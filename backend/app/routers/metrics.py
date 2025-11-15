"""
/v1/metrics endpoint router.
Stores user reactions to push notifications (sent, opened, clicked).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import logging
from ..database import get_db
from ..schemas import MetricRequest, MetricResponse
from ..models import Metric

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1", tags=["metrics"])


ALLOWED_EVENT_TYPES = {"sent", "opened", "clicked"}


@router.post("/metrics", response_model=MetricResponse)
def record_metric(
    request: MetricRequest,
    db: Session = Depends(get_db)
) -> MetricResponse:
    """
    Record a user reaction metric.
    
    Allowed event types:
    - sent: Notification was sent to user
    - opened: User opened the notification
    - clicked: User clicked on the notification
    
    Args:
        request: Metric data
        db: Database session
        
    Returns:
        MetricResponse with status "ok"
    """
    # Validate event type
    if request.event_type not in ALLOWED_EVENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid event_type. Must be one of: {', '.join(ALLOWED_EVENT_TYPES)}"
        )
    
    try:
        # Parse variant_id as UUID
        try:
            variant_uuid = UUID(request.variant_id)
        except ValueError:
            logger.warning(f"Invalid variant_id format: {request.variant_id}, skipping metric")
            # Return OK even if variant_id is invalid (could be temp ID)
            return MetricResponse(status="ok")
        
        # Create metric record
        metric = Metric(
            user_id=request.user_id,
            intent_id=request.intent_id,
            variant_id=variant_uuid,
            event_type=request.event_type,
            timestamp=request.timestamp
        )
        
        db.add(metric)
        db.commit()
        
        logger.info(
            f"Recorded {request.event_type} metric for user {request.user_id}, "
            f"variant {request.variant_id}"
        )
        
        return MetricResponse(status="ok")
        
    except Exception as e:
        logger.error(f"Error recording metric: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to record metric: {str(e)}")
