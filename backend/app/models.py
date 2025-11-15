"""
SQLAlchemy ORM models for PushBunny database.
Defines tables: variants, metrics, api_keys.
"""

from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .database import Base


class Variant(Base):
    """
    Stores AI-generated message variants.
    Each variant represents a different message for a given intent.
    """
    __tablename__ = "variants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    intent_id = Column(Text, nullable=False, index=True)
    message = Column(Text, nullable=False)
    locale = Column(Text, nullable=False, default="en-US")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Variant {self.id} intent={self.intent_id}>"


class Metric(Base):
    """
    Stores user reactions to push notifications.
    Tracks sent, opened, and clicked events.
    """
    __tablename__ = "metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Text, nullable=False, index=True)
    intent_id = Column(Text, nullable=False, index=True)
    variant_id = Column(UUID(as_uuid=True), ForeignKey("variants.id"), nullable=False, index=True)
    event_type = Column(Text, nullable=False)  # sent, opened, clicked
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False)
    
    def __repr__(self):
        return f"<Metric {self.id} user={self.user_id} event={self.event_type}>"


class ApiKey(Base):
    """
    Optional: Stores API keys for authentication.
    Used for dashboard and backend access control.
    """
    __tablename__ = "api_keys"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String(255), unique=True, nullable=False, index=True)
    owner = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<ApiKey {self.id} owner={self.owner}>"
