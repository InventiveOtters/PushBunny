"""Statistics endpoint."""

from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_api_key, get_db_session
from app.schemas.stats import StatsResponse
from app.services.stats_service import StatsService
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    intent_id: str = Query(..., description="The intent ID to get stats for"),
    date_from: Optional[datetime] = Query(None, description="Start date filter (ISO format)"),
    date_to: Optional[datetime] = Query(None, description="End date filter (ISO format)"),
    db: Session = Depends(get_db_session),
    api_key: str = Depends(get_current_api_key)
) -> StatsResponse:
    """
    Get performance statistics for a notification intent.
    
    Returns aggregated metrics including:
    - Total impressions, opens, conversions
    - Overall open and conversion rates
    - Per-variant breakdowns
    
    **Authentication:** Requires valid API key in Authorization header.
    
    **Query Parameters:**
    - `intent_id`: Required. The notification intent ID.
    - `date_from`: Optional. Filter events from this date (ISO 8601 format).
    - `date_to`: Optional. Filter events until this date (ISO 8601 format).
    
    **Example Request:**
    ```
    GET /v1/stats?intent_id=cart_abandonment_reminder
    ```
    
    **Example Response:**
    ```json
    {
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
                "impressions": 1667,
                "opens": 250,
                "open_rate": 0.15,
                "conversions": 40,
                "conversion_rate": 0.024
            },
            {
                "variant_id": "var_def456",
                "text": "Don't forget your cart items! 🛒",
                "impressions": 1667,
                "opens": 267,
                "open_rate": 0.16,
                "conversions": 43,
                "conversion_rate": 0.026
            },
            {
                "variant_id": "var_ghi789",
                "text": "Your cart is waiting - complete checkout now",
                "impressions": 1666,
                "opens": 233,
                "open_rate": 0.14,
                "conversions": 37,
                "conversion_rate": 0.022
            }
        ]
    }
    ```
    """
    try:
        stats_service = StatsService(db)
        stats = stats_service.get_intent_stats(intent_id, date_from, date_to)
        return stats
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get stats: {str(e)}"
        )
