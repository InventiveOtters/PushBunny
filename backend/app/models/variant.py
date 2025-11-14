"""Variant model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.db.base import Base


class Variant(Base):
    """
    Variant represents a specific message text for an experiment.
    Multiple variants belong to one experiment.
    """
    __tablename__ = "variants"
    
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(Integer, ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(String(255), unique=True, index=True, nullable=False)
    text = Column(Text, nullable=False)
    weight = Column(Integer, default=1, nullable=False)  # For round-robin, all weights = 1
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    experiment = relationship("Experiment", back_populates="variants")
    impressions = relationship("Impression", back_populates="variant", cascade="all, delete-orphan")
