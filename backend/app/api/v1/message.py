"""Message generation endpoint."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_api_key, get_db_session
from app.schemas.notification_intent import NotificationIntent
from app.schemas.message_result import MessageResult
from app.services.experiment_service import ExperimentService
from app.core.exceptions import LLMServiceException

router = APIRouter()


@router.post("/message", response_model=MessageResult)
async def generate_message(
    intent: NotificationIntent,
    db: Session = Depends(get_db_session),
    api_key: str = Depends(get_current_api_key)
) -> MessageResult:
    """
    Generate or select a message variant for a notification intent.
    
    This endpoint:
    1. Finds or creates an experiment for the intent_id
    2. Generates variants using LLM if this is a new intent
    3. Selects a variant using round-robin
    4. Records an impression
    5. Returns the message with tracking token
    
    **Authentication:** Requires valid API key in Authorization header.
    
    **Example Request:**
    ```json
    {
        "intent_id": "cart_abandonment_reminder",
        "base_example": "You left items in your cart",
        "locale": "en-US",
        "user_id": "user_12345",
        "context": {
            "when": "2 hours after cart abandonment",
            "screen": "checkout"
        }
    }
    ```
    
    **Example Response:**
    ```json
    {
        "text": "Complete your purchase - items waiting in cart!",
        "variant_id": "var_abc123",
        "experiment_id": "exp_cart_001",
        "tracking_token": "trk_xyz789"
    }
    ```
    """
    try:
        experiment_service = ExperimentService(db)
        result = experiment_service.generate_message(intent)
        return result
    except LLMServiceException as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate message: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
