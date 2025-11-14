"""Stats service for aggregating metrics."""

from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.experiment import Experiment
from app.models.variant import Variant
from app.models.impression import Impression
from app.models.event import Event, EventType
from app.schemas.stats import StatsResponse, VariantStats
from app.core.exceptions import NotFoundException


class StatsService:
    """Service for calculating and aggregating statistics."""
    
    def __init__(self, db: Session):
        """Initialize the service with a database session."""
        self.db = db
    
    def get_intent_stats(
        self,
        intent_id: str,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> StatsResponse:
        """
        Get statistics for a specific intent.
        
        Args:
            intent_id: The intent ID
            date_from: Optional start date filter
            date_to: Optional end date filter
            
        Returns:
            StatsResponse with aggregated metrics
            
        Raises:
            NotFoundException: If intent doesn't exist
        """
        # Get experiment
        experiment = self.db.query(Experiment).filter(
            Experiment.intent_id == intent_id
        ).first()
        
        if not experiment:
            raise NotFoundException(f"Intent '{intent_id}' not found")
        
        # Get variants
        variants = self.db.query(Variant).filter(
            Variant.experiment_id == experiment.id
        ).all()
        
        if not variants:
            return StatsResponse(
                intent_id=intent_id,
                total_impressions=0,
                total_opens=0,
                overall_open_rate=0.0,
                total_conversions=0,
                overall_conversion_rate=0.0,
                variants=[]
            )
        
        # Calculate stats for each variant
        variant_stats_list = []
        total_impressions = 0
        total_opens = 0
        total_conversions = 0
        
        for variant in variants:
            stats = self._calculate_variant_stats(
                variant, 
                date_from, 
                date_to
            )
            variant_stats_list.append(stats)
            total_impressions += stats.impressions
            total_opens += stats.opens
            total_conversions += stats.conversions
        
        # Calculate overall rates
        overall_open_rate = total_opens / total_impressions if total_impressions > 0 else 0.0
        overall_conversion_rate = total_conversions / total_impressions if total_impressions > 0 else 0.0
        
        return StatsResponse(
            intent_id=intent_id,
            total_impressions=total_impressions,
            total_opens=total_opens,
            overall_open_rate=overall_open_rate,
            total_conversions=total_conversions,
            overall_conversion_rate=overall_conversion_rate,
            variants=variant_stats_list
        )
    
    def _calculate_variant_stats(
        self,
        variant: Variant,
        date_from: Optional[datetime],
        date_to: Optional[datetime]
    ) -> VariantStats:
        """Calculate statistics for a single variant."""
        # Base query for impressions
        impression_query = self.db.query(Impression).filter(
            Impression.variant_id == variant.id
        )
        
        # Apply date filters
        if date_from:
            impression_query = impression_query.filter(
                Impression.created_at >= date_from
            )
        if date_to:
            impression_query = impression_query.filter(
                Impression.created_at <= date_to
            )
        
        # Get impression count
        impressions = impression_query.count()
        
        if impressions == 0:
            return VariantStats(
                variant_id=variant.variant_id,
                text=variant.text,
                impressions=0,
                opens=0,
                open_rate=0.0,
                conversions=0,
                conversion_rate=0.0
            )
        
        # Get tracking tokens for this variant
        tracking_tokens = [imp.tracking_token for imp in impression_query.all()]
        
        # Count opens
        opens_query = self.db.query(func.count(Event.id)).filter(
            Event.tracking_token.in_(tracking_tokens),
            Event.event_type == EventType.OPENED
        )
        opens = opens_query.scalar() or 0
        
        # Count conversions
        conversions_query = self.db.query(func.count(Event.id)).filter(
            Event.tracking_token.in_(tracking_tokens),
            Event.event_type == EventType.CONVERSION
        )
        conversions = conversions_query.scalar() or 0
        
        # Calculate rates
        open_rate = opens / impressions if impressions > 0 else 0.0
        conversion_rate = conversions / impressions if impressions > 0 else 0.0
        
        return VariantStats(
            variant_id=variant.variant_id,
            text=variant.text,
            impressions=impressions,
            opens=opens,
            open_rate=open_rate,
            conversions=conversions,
            conversion_rate=conversion_rate
        )
