"""Events tracking endpoint."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_api_key, get_db_session
from app.schemas.event import PushBunnyEvent
from app.services.event_service import EventService

router = APIRouter()


@router.post("/events")
async def track_events(
    events: List[PushBunnyEvent],
    db: Session = Depends(get_db_session),
    api_key: str = Depends(get_current_api_key)
) -> dict:
    """
    Track user events (notification opens, conversions).
    
    This endpoint receives a batch of events from the SDK and records them
    in the database for analytics and optimization.
    
    **Authentication:** Requires valid API key in Authorization header.
    
    **Example Request:**
    ```json
    [
        {
            "type": "opened",
            "tracking_token": "trk_xyz789",
            "timestamp": 1699999999000,
            "properties": {
                "screen": "home"
            }
        },
        {
            "type": "conversion",
            "tracking_token": "trk_xyz789",
            "timestamp": 1700000100000,
            "properties": {
                "conversion_value": "29.99"
            }
        }
    ]
    ```
    
    **Example Response:**
    ```json
    {
        "recorded": 2,
        "total": 2
    }
    ```
    """
    try:
        event_service = EventService(db)
        recorded_count = event_service.record_events(events)
        
        return {
            "recorded": recorded_count,
            "total": len(events)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record events: {str(e)}"
        )
