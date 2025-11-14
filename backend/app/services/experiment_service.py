"""Experiment service for managing experiments and variant selection."""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.experiment import Experiment, ExperimentStatus
from app.models.variant import Variant
from app.models.impression import Impression
from app.schemas.notification_intent import NotificationIntent
from app.schemas.message_result import MessageResult
from app.services.llm_service import LLMService
from app.utils.tracking_token import (
    generate_tracking_token,
    generate_variant_id,
    generate_experiment_id
)


class ExperimentService:
    """Service for managing experiments and variants."""
    
    def __init__(self, db: Session):
        """Initialize the service with a database session."""
        self.db = db
        self.llm_service = LLMService()
    
    def get_or_create_experiment(
        self, 
        intent: NotificationIntent
    ) -> Experiment:
        """
        Get existing experiment or create a new one with generated variants.
        
        Args:
            intent: The notification intent
            
        Returns:
            Experiment instance
        """
        # Try to find existing experiment
        experiment = self.db.query(Experiment).filter(
            Experiment.intent_id == intent.intent_id
        ).first()
        
        if experiment:
            return experiment
        
        # Create new experiment
        experiment = Experiment(
            intent_id=intent.intent_id,
            base_example=intent.base_example,
            locale=intent.locale,
            status=ExperimentStatus.ACTIVE
        )
        self.db.add(experiment)
        self.db.flush()  # Get the ID
        
        # Generate variants using LLM
        variant_texts = self.llm_service.generate_variants(intent, count=3)
        
        # Create variant records
        for text in variant_texts:
            variant = Variant(
                experiment_id=experiment.id,
                variant_id=generate_variant_id(),
                text=text,
                weight=1
            )
            self.db.add(variant)
        
        self.db.commit()
        self.db.refresh(experiment)
        
        return experiment
    
    def select_variant(self, experiment_id: int) -> Optional[Variant]:
        """
        Select a variant using round-robin selection.
        
        Args:
            experiment_id: The experiment ID
            
        Returns:
            Selected Variant or None if no variants exist
        """
        # Get all variants for the experiment
        variants = self.db.query(Variant).filter(
            Variant.experiment_id == experiment_id
        ).all()
        
        if not variants:
            return None
        
        # Get impression counts for each variant
        impression_counts = {}
        for variant in variants:
            count = self.db.query(func.count(Impression.id)).filter(
                Impression.variant_id == variant.id
            ).scalar() or 0
            impression_counts[variant.id] = count
        
        # Select variant with lowest impression count (round-robin)
        selected_variant = min(variants, key=lambda v: impression_counts[v.id])
        
        return selected_variant
    
    def create_impression(
        self, 
        variant_id: int, 
        user_id: Optional[str] = None
    ) -> str:
        """
        Create an impression record and return tracking token.
        
        Args:
            variant_id: The variant ID
            user_id: Optional user ID
            
        Returns:
            Tracking token for this impression
        """
        tracking_token = generate_tracking_token()
        
        impression = Impression(
            variant_id=variant_id,
            tracking_token=tracking_token,
            user_id=user_id
        )
        self.db.add(impression)
        self.db.commit()
        
        return tracking_token
    
    def generate_message(self, intent: NotificationIntent) -> MessageResult:
        """
        Main method to generate a message for a notification intent.
        
        This orchestrates:
        1. Get or create experiment
        2. Select variant
        3. Record impression
        4. Return message result
        
        Args:
            intent: The notification intent
            
        Returns:
            MessageResult with selected text and tracking info
        """
        # Get or create experiment
        experiment = self.get_or_create_experiment(intent)
        
        # Select variant
        variant = self.select_variant(experiment.id)
        
        if not variant:
            # Fallback to base example if no variants
            return MessageResult(
                text=intent.base_example,
                variant_id="fallback",
                experiment_id=str(experiment.id),
                tracking_token="no_tracking"
            )
        
        # Create impression
        tracking_token = self.create_impression(variant.id, intent.user_id)
        
        # Return result
        return MessageResult(
            text=variant.text,
            variant_id=variant.variant_id,
            experiment_id=str(experiment.id),
            tracking_token=tracking_token
        )
