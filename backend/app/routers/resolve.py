"""
/v1/resolve endpoint router.
Returns optimized push notification message for a given intent.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from ..database import get_db
from ..schemas import ResolveRequest, ResolveResponse, N8nRequest
from ..services.n8n_client import n8n_client
from ..services.variant_logic import store_variant

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["resolve"])


@router.post("/resolve", response_model=ResolveResponse)
async def resolve_intent(
    request: ResolveRequest,
    db: Session = Depends(get_db)
) -> ResolveResponse:
    """
    Resolve a notification intent to an optimized message.
    
    Flow:
    1. Receive intent payload from SDK
    2. Call n8n with the payload
    3. n8n uses Gemini to generate/select a variant
    4. Store the variant if new
    5. Return the selected message
    
    Args:
        request: Intent request data
        db: Database session
        
    Returns:
        ResolveResponse with variant_id and resolved_message
    """
    try:
        logger.info(f"Resolving intent {request.intent_id}")
        
        # Prepare n8n request
        n8n_request = N8nRequest(
            intent_id=request.intent_id,
            locale=request.locale,
            context=request.context,
            base_message=request.base_message,
            timestamp=request.timestamp
        )
        
        # Call n8n workflow
        try:
            n8n_response = await n8n_client.resolve_intent(n8n_request)
        except Exception as e:
            logger.error(f"n8n call failed, falling back to base message: {e}")
            # Fallback to base message if n8n fails
            variant = store_variant(
                db=db,
                intent_id=request.intent_id,
                message=request.base_message,
                locale=request.locale
            )
            return ResolveResponse(
                variant_id=str(variant.id),
                resolved_message=request.base_message
            )
        
        # Store variant if needed
        if n8n_response.should_store_variant:
            variant = store_variant(
                db=db,
                intent_id=request.intent_id,
                message=n8n_response.variant_message,
                locale=request.locale
            )
            variant_id = str(variant.id)
        else:
            # If not storing, generate a temporary ID
            variant_id = f"temp_{request.intent_id}"
        
        logger.info(f"Resolved to variant {variant_id}")
        
        return ResolveResponse(
            variant_id=variant_id,
            resolved_message=n8n_response.variant_message
        )
        
    except Exception as e:
        logger.error(f"Error resolving intent: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to resolve intent: {str(e)}")
