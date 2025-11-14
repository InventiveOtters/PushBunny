"""Notification Intent schema."""

from typing import Dict, Optional
from pydantic import BaseModel, Field


class NotificationIntent(BaseModel):
    """
    NotificationIntent is what the client SDK sends to request a message.
    
    Example:
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
    """
    intent_id: str = Field(..., description="Unique identifier for this notification intent")
    base_example: str = Field(..., description="Developer's reference text")
    locale: Optional[str] = Field(None, description="Locale code (e.g., 'en-US')")
    user_id: Optional[str] = Field(None, description="Optional user identifier")
    context: Dict[str, str] = Field(default_factory=dict, description="Additional context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "intent_id": "cart_abandonment_reminder",
                "base_example": "You left items in your cart",
                "locale": "en-US",
                "user_id": "user_12345",
                "context": {
                    "when": "2 hours after cart abandonment",
                    "screen": "checkout"
                }
            }
        }
