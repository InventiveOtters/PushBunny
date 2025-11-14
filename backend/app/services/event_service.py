"""Event service for tracking user events."""

from typing import List
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.event import Event, EventType as EventTypeModel
from app.models.impression import Impression
from app.schemas.event import PushBunnyEvent, EventType


class EventService:
    """Service for tracking and processing events."""
    
    def __init__(self, db: Session):
        """Initialize the service with a database session."""
        self.db = db
    
    def record_events(self, events: List[PushBunnyEvent]) -> int:
        """
        Record a batch of events.
        
        Args:
            events: List of events to record
            
        Returns:
            Number of events recorded
        """
        recorded_count = 0
        
        for event in events:
            # Verify tracking token exists
            impression = self.db.query(Impression).filter(
                Impression.tracking_token == event.tracking_token
            ).first()
            
            if not impression:
                # Skip invalid tracking tokens
                continue
            
            # Convert EventType to EventTypeModel
            event_type = (
                EventTypeModel.OPENED 
                if event.type == EventType.NOTIFICATION_OPENED 
                else EventTypeModel.CONVERSION
            )
            
            # Create event record
            event_record = Event(
                tracking_token=event.tracking_token,
                event_type=event_type,
                timestamp=datetime.fromtimestamp(event.timestamp / 1000.0),
                properties=event.properties
            )
            self.db.add(event_record)
            recorded_count += 1
        
        self.db.commit()
        
        return recorded_count
    
    def get_event_count(
        self, 
        tracking_token: str, 
        event_type: EventTypeModel
    ) -> int:
        """
        Get count of events for a tracking token.
        
        Args:
            tracking_token: The tracking token
            event_type: The event type to count
            
        Returns:
            Count of events
        """
        count = self.db.query(Event).filter(
            Event.tracking_token == tracking_token,
            Event.event_type == event_type
        ).count()
        
        return count
