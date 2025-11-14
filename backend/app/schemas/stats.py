"""Stats schema."""

from typing import List
from pydantic import BaseModel, Field


class VariantStats(BaseModel):
    """Statistics for a single variant."""
    variant_id: str = Field(..., description="Variant identifier")
    text: str = Field(..., description="Variant text")
    impressions: int = Field(..., description="Number of times sent")
    opens: int = Field(..., description="Number of opens")
    open_rate: float = Field(..., description="Open rate (0-1)")
    conversions: int = Field(0, description="Number of conversions")
    conversion_rate: float = Field(0.0, description="Conversion rate (0-1)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "variant_id": "var_abc123",
                "text": "Complete your purchase - items waiting in cart!",
                "impressions": 1000,
                "opens": 150,
                "open_rate": 0.15,
                "conversions": 25,
                "conversion_rate": 0.025
            }
        }


class StatsResponse(BaseModel):
    """Response for stats endpoint."""
    intent_id: str = Field(..., description="Intent identifier")
    total_impressions: int = Field(..., description="Total impressions across all variants")
    total_opens: int = Field(..., description="Total opens across all variants")
    overall_open_rate: float = Field(..., description="Overall open rate")
    total_conversions: int = Field(0, description="Total conversions")
    overall_conversion_rate: float = Field(0.0, description="Overall conversion rate")
    variants: List[VariantStats] = Field(..., description="Per-variant statistics")
    
    class Config:
        json_schema_extra = {
            "example": {
                "intent_id": "cart_abandonment_reminder",
                "total_impressions": 5000,
                "total_opens": 750,
                "overall_open_rate": 0.15,
                "total_conversions": 120,
                "overall_conversion_rate": 0.024,
                "variants": [
                    {
                        "variant_id": "var_abc123",
                        "text": "Complete your purchase - items waiting in cart!",
                        "impressions": 1000,
                        "opens": 150,
                        "open_rate": 0.15,
                        "conversions": 25,
                        "conversion_rate": 0.025
                    }
                ]
            }
        }
