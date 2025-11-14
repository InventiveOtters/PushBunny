"""Event model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class EventType(str, enum.Enum):
    """Event type enum."""
    OPENED = "opened"
    CONVERSION = "conversion"


class Event(Base):
    """
    Event records user actions (opens, conversions) tied to an impression.
    """
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    tracking_token = Column(
        String(255), 
        ForeignKey("impressions.tracking_token", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    event_type = Column(Enum(EventType), nullable=False, index=True)
    timestamp = Column(DateTime, nullable=False)
    properties = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    impression = relationship("Impression", back_populates="events")
