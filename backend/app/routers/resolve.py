"""
/v1/resolve endpoint router.
Returns optimized push notification message for a given intent.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
import random
from ..database import get_db
from ..schemas import ResolveRequest, ResolveResponse, N8nRequest
from ..services.n8n_client import n8n_client
from ..services.variant_logic import store_variant, get_variants_with_metrics, find_duplicate_variant
from ..config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["resolve"])
settings = get_settings()


def thompson_sample_variant(variants: list[dict]) -> tuple[dict, bool]:
    """
    Select variant using Thompson Sampling (Bayesian multi-armed bandit).

    Thompson Sampling automatically balances exploration vs exploitation by:
    1. Modeling each variant's CTR as a Beta distribution
    2. Sampling from each distribution
    3. Picking the variant with the highest sample

    This is statistically optimal and adapts exploration based on uncertainty.

    Args:
        variants: List of variant dicts with 'sent' and 'clicked' counts

    Returns:
        Tuple of (selected_variant, should_generate_new)
        - selected_variant: The chosen variant dict
        - should_generate_new: True if we should generate a new variant instead
    """
    if not variants:
        return None, True

    total_sent = sum(v['sent'] for v in variants)

    # Always explore if we don't have enough data yet
    if total_sent < settings.ab_exploration_threshold:
        return None, True

    # Thompson Sampling: Sample from Beta distribution for each variant
    samples = []
    for variant in variants:
        successes = variant['clicked']
        failures = variant['sent'] - variant['clicked']

        # Beta(alpha, beta) where alpha = successes + 1, beta = failures + 1
        # The +1 is a prior (assumes each variant has 1 success and 1 failure)
        alpha = successes + 1
        beta = failures + 1

        # Sample from the Beta distribution
        sample = random.betavariate(alpha, beta)
        samples.append((sample, variant))

    # Select variant with highest sample
    _, best_variant = max(samples, key=lambda x: x[0])

    # Small probability to generate new variant (controlled exploration)
    # This ensures we occasionally try completely new messages
    if random.random() < settings.ab_exploration_rate:
        return None, True

    return best_variant, False


@router.post("/resolve", response_model=ResolveResponse)
async def resolve_intent(
    request: ResolveRequest,
    db: Session = Depends(get_db)
) -> ResolveResponse:
    """
    Resolve a notification intent to an optimized message.

    Flow (with Thompson Sampling A/B testing):
    1. Check existing variants for this intent
    2. Use Thompson Sampling (Bayesian multi-armed bandit):
       - Models each variant's CTR as a Beta distribution
       - Samples from distributions and picks highest
       - Automatically balances exploration vs exploitation
       - Variants with less data get explored more
       - Converges to optimal variant faster than epsilon-greedy
    3. If not enough data, always explore (generate new variants)
    4. Track all variants for continuous optimization

    Args:
        request: Intent request data
        db: Database session

    Returns:
        ResolveResponse with variant_id and resolved_message
    """
    try:
        logger.info(f"Resolving intent {request.intent_id}")

        existing_variants = get_variants_with_metrics(db, request.intent_id)

        # Use Thompson Sampling to select variant or decide to explore
        selected_variant, should_generate_new = thompson_sample_variant(existing_variants)

        if selected_variant and not should_generate_new:
            # Thompson Sampling selected an existing variant
            ctr = selected_variant['clicked'] / selected_variant['sent'] if selected_variant['sent'] > 0 else 0
            logger.info(
                f"Thompson Sampling: Selected variant {selected_variant['variant_id']} "
                f"(CTR: {selected_variant['clicked']}/{selected_variant['sent']} = {ctr:.1%})"
            )
            return ResolveResponse(
                variant_id=selected_variant['variant_id'],
                resolved_message=selected_variant['message']
            )

        # Generate new variant (exploration)
        logger.info(f"Thompson Sampling: Generating new variant for intent {request.intent_id}")

        n8n_request = N8nRequest(
            intent_id=request.intent_id,
            locale=request.locale,
            context=request.context,
            base_message=request.base_message,
            timestamp=request.timestamp
        )

        # Try to generate a unique variant (with retries for duplicates)
        max_retries = settings.ab_duplicate_retry_max
        for attempt in range(max_retries):
            try:
                n8n_response = await n8n_client.resolve_intent(n8n_request)
            except Exception as e:
                logger.error(f"n8n call failed, falling back to base message: {e}")
                variant = store_variant(
                    db=db,
                    intent_id=request.intent_id,
                    message=request.base_message,
                    locale=request.locale,
                    check_duplicates=True
                )
                return ResolveResponse(
                    variant_id=str(variant.id),
                    resolved_message=variant.message
                )

            # Check if this message is a duplicate
            if n8n_response.should_store_variant:
                duplicate = find_duplicate_variant(
                    db=db,
                    intent_id=request.intent_id,
                    message=n8n_response.variant_message,
                    locale=request.locale
                )

                if duplicate and attempt < max_retries - 1:
                    # Duplicate found and we have retries left
                    logger.info(
                        f"AI generated duplicate message (attempt {attempt + 1}/{max_retries}), "
                        f"retrying with enhanced context..."
                    )
                    # Enhance context to encourage different variant
                    n8n_request.context = (
                        f"{n8n_request.context or ''} "
                        f"[Generate a DIFFERENT message, avoid: '{n8n_response.variant_message}']"
                    ).strip()
                    continue  # Retry
                elif duplicate:
                    # Duplicate found but no retries left, reuse existing
                    logger.warning(
                        f"AI generated duplicate after {max_retries} attempts, "
                        f"reusing existing variant {duplicate.id}"
                    )
                    return ResolveResponse(
                        variant_id=str(duplicate.id),
                        resolved_message=duplicate.message
                    )
                else:
                    # Not a duplicate, store it
                    variant = store_variant(
                        db=db,
                        intent_id=request.intent_id,
                        message=n8n_response.variant_message,
                        locale=request.locale,
                        check_duplicates=False  # Already checked above
                    )
                    logger.info(f"Resolved to new unique variant {variant.id}")
                    return ResolveResponse(
                        variant_id=str(variant.id),
                        resolved_message=n8n_response.variant_message
                    )
            else:
                # Temporary variant (not stored)
                variant_id = f"temp_{request.intent_id}"
                logger.info(f"Resolved to temporary variant {variant_id}")
                return ResolveResponse(
                    variant_id=variant_id,
                    resolved_message=n8n_response.variant_message
                )

        # Should not reach here, but fallback just in case
        logger.error("Unexpected state in variant generation loop")
        raise HTTPException(status_code=500, detail="Failed to generate unique variant")

    except Exception as e:
        logger.error(f"Error resolving intent: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to resolve intent: {str(e)}")
