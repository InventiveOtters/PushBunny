"""Impression model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Impression(Base):
    """
    Impression records when a variant was shown/sent to a user.
    Each impression gets a unique tracking_token for event correlation.
    """
    __tablename__ = "impressions"
    
    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("variants.id", ondelete="CASCADE"), nullable=False)
    tracking_token = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    variant = relationship("Variant", back_populates="impressions")
    events = relationship("Event", back_populates="impression", cascade="all, delete-orphan")
