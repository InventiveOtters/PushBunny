"""Experiment model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Enum, DateTime
from sqlalchemy.orm import relationship
import enum

from app.db.base import Base


class ExperimentStatus(str, enum.Enum):
    """Experiment status enum."""
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class Experiment(Base):
    """
    Experiment represents a notification intent with multiple text variants.
    Each intent_id maps to one experiment with multiple variants.
    """
    __tablename__ = "experiments"
    
    id = Column(Integer, primary_key=True, index=True)
    intent_id = Column(String(255), unique=True, index=True, nullable=False)
    base_example = Column(Text, nullable=False)
    locale = Column(String(10), nullable=True)
    status = Column(Enum(ExperimentStatus), default=ExperimentStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    variants = relationship("Variant", back_populates="experiment", cascade="all, delete-orphan")
