"""API Key model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime

from app.db.base import Base


class APIKey(Base):
    """
    API Key for authentication.
    In MVP, keys are stored in environment variables.
    This model is for future use when API key management is needed.
    """
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    organization_id = Column(String(255), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
