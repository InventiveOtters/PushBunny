"""
/v1/variants endpoint router.
Retrieves variants with aggregated metrics for dashboard.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging
from ..database import get_db
from ..schemas import VariantSummary
from ..services.variant_logic import get_variants_with_metrics

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["variants"])


@router.get("/variants/{intent_id}", response_model=list[VariantSummary])
def get_variants(
    intent_id: str,
    db: Session = Depends(get_db)
) -> list[VariantSummary]:
    """
    Get all variants for a given intent with aggregated metrics.
    
    Used by the dashboard to display variant performance.
    
    Args:
        intent_id: Intent identifier
        db: Database session
        
    Returns:
        List of VariantSummary objects with metrics
    """
    try:
        variants_data = get_variants_with_metrics(db, intent_id)
        
        if not variants_data:
            logger.info(f"No variants found for intent {intent_id}")
            return []
        
        logger.info(f"Retrieved {len(variants_data)} variants for intent {intent_id}")
        
        return [VariantSummary(**v) for v in variants_data]
        
    except Exception as e:
        logger.error(f"Error retrieving variants: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve variants: {str(e)}")
