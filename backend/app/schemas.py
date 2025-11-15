"""
Pydantic schemas for request/response validation.
Defines data models for all API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


# /v1/resolve schemas

class ResolveRequest(BaseModel):
    """Request schema for /v1/resolve endpoint."""
    api_key: Optional[str] = None
    intent_id: str = Field(..., description="Intent identifier from SDK")
    locale: Optional[str] = Field(default="en-US", description="User locale")
    context: str = Field(default="", description="Additional context as string")
    base_message: str = Field(..., description="Fallback message if AI fails")
    timestamp: Optional[datetime] = None


class ResolveResponse(BaseModel):
    """Response schema for /v1/resolve endpoint."""
    variant_id: str
    resolved_message: str


# /v1/metrics schemas

class MetricRequest(BaseModel):
    """Request schema for /v1/metrics endpoint."""
    variant_id: str
    event_type: str = Field(..., description="Event type: 'sent' or 'clicked'")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "variant_id": "a2f3c523-9240-4013-8e86-acf2600c6129",
                "event_type": "clicked",
                "timestamp": "2025-02-15T12:01:12Z"
            }
        }


class MetricResponse(BaseModel):
    """Response schema for /v1/metrics endpoint."""
    status: str = "ok"


# /v1/auth schemas

class LoginRequest(BaseModel):
    """Request schema for /v1/auth/login endpoint."""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Response schema for /v1/auth/login endpoint."""
    api_key: str


# /v1/variants schemas

class VariantSummary(BaseModel):
    """Summary of a variant with aggregated metrics."""
    variant_id: str
    message: str
    sent: int = 0
    opened: int = 0
    clicked: int = 0
    
    class Config:
        from_attributes = True


# n8n integration schemas

class N8nRequest(BaseModel):
    """Request schema for n8n webhook."""
    intent_id: str
    locale: str
    context: str
    base_message: str
    timestamp: Optional[datetime] = None


class N8nResponse(BaseModel):
    """Response schema from n8n webhook."""
    variant_message: str
    should_store_variant: bool = True
