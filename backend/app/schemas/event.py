"""Event schema."""

from typing import Dict, Optional
from enum import Enum
from pydantic import BaseModel, Field


class EventType(str, Enum):
    """Event type enumeration."""
    NOTIFICATION_OPENED = "opened"
    CONVERSION = "conversion"


class PushBunnyEvent(BaseModel):
    """
    PushBunnyEvent is sent by the SDK when a user action occurs.
    
    Example:
        {
            "type": "opened",
            "tracking_token": "trk_xyz789",
            "timestamp": 1699999999000,
            "properties": {
                "screen": "home"
            }
        }
    """
    type: EventType = Field(..., description="Event type")
    tracking_token: str = Field(..., description="Token from MessageResult")
    timestamp: int = Field(..., description="Unix timestamp in milliseconds")
    properties: Dict[str, str] = Field(default_factory=dict, description="Additional properties")
    
    class Config:
        json_schema_extra = {
            "example": {
                "type": "opened",
                "tracking_token": "trk_xyz789",
                "timestamp": 1699999999000,
                "properties": {
                    "screen": "home"
                }
            }
        }
