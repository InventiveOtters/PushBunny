"""Message Result schema."""

from pydantic import BaseModel, Field


class MessageResult(BaseModel):
    """
    MessageResult is what the backend returns after selecting a variant.
    
    Example:
        {
            "text": "Complete your purchase - items waiting in cart!",
            "variant_id": "var_abc123",
            "experiment_id": "exp_cart_001",
            "tracking_token": "trk_xyz789"
        }
    """
    text: str = Field(..., description="The actual push notification body to use")
    variant_id: str = Field(..., description="Unique ID for this text variant")
    experiment_id: str = Field(..., description="ID grouping variants under one experiment")
    tracking_token: str = Field(..., description="Opaque token for event correlation")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "Complete your purchase - items waiting in cart!",
                "variant_id": "var_abc123",
                "experiment_id": "exp_cart_001",
                "tracking_token": "trk_xyz789"
            }
        }
