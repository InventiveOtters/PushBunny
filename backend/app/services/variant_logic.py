"""
Variant selection and storage logic.
Handles storage of new variants and retrieval of existing ones.
"""

import logging
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import Variant, Metric

logger = logging.getLogger(__name__)


def store_variant(
    db: Session,
    intent_id: str,
    message: str,
    locale: str = "en-US"
) -> Variant:
    """
    Store a new variant in the database.
    
    Args:
        db: Database session
        intent_id: Intent identifier
        message: AI-generated message text
        locale: Message locale
        
    Returns:
        Created Variant instance
    """
    variant = Variant(
        intent_id=intent_id,
        message=message,
        locale=locale
    )
    db.add(variant)
    db.commit()
    db.refresh(variant)
    
    logger.info(f"Stored new variant {variant.id} for intent {intent_id}")
    return variant


def get_variant_by_id(db: Session, variant_id: UUID) -> Optional[Variant]:
    """
    Retrieve a variant by its ID.
    
    Args:
        db: Database session
        variant_id: UUID of the variant
        
    Returns:
        Variant instance or None if not found
    """
    return db.query(Variant).filter(Variant.id == variant_id).first()


def get_variants_with_metrics(db: Session, intent_id: str) -> list[dict]:
    """
    Get all variants for an intent with aggregated metrics.
    
    Args:
        db: Database session
        intent_id: Intent identifier
        
    Returns:
        List of dicts with variant info and metrics counts
    """
    # Query variants
    variants = db.query(Variant).filter(Variant.intent_id == intent_id).all()
    
    result = []
    for variant in variants:
        # Count metrics for each event type
        sent = db.query(Metric).filter(
            Metric.variant_id == variant.id,
            Metric.event_type == "sent"
        ).count()
        
        opened = db.query(Metric).filter(
            Metric.variant_id == variant.id,
            Metric.event_type == "opened"
        ).count()
        
        clicked = db.query(Metric).filter(
            Metric.variant_id == variant.id,
            Metric.event_type == "clicked"
        ).count()
        
        result.append({
            "variant_id": str(variant.id),
            "message": variant.message,
            "sent": sent,
            "opened": opened,
            "clicked": clicked
        })
    
    return result


def get_best_variant(db: Session, intent_id: str, locale: str = "en-US") -> Optional[Variant]:
    """
    Get the best-performing variant for an intent based on click-through rate.
    This is a simple implementation; can be enhanced with more sophisticated logic.
    
    Args:
        db: Database session
        intent_id: Intent identifier
        locale: Preferred locale
        
    Returns:
        Best variant or None if no variants exist
    """
    variants = db.query(Variant).filter(
        Variant.intent_id == intent_id,
        Variant.locale == locale
    ).all()
    
    if not variants:
        return None
    
    # Calculate CTR for each variant
    best_variant = None
    best_ctr = -1
    
    for variant in variants:
        sent = db.query(Metric).filter(
            Metric.variant_id == variant.id,
            Metric.event_type == "sent"
        ).count()
        
        clicked = db.query(Metric).filter(
            Metric.variant_id == variant.id,
            Metric.event_type == "clicked"
        ).count()
        
        ctr = clicked / sent if sent > 0 else 0
        
        if ctr > best_ctr:
            best_ctr = ctr
            best_variant = variant
    
    return best_variant or variants[0]  # Return first if all have 0 CTR
