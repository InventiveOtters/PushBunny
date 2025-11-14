"""Database initialization."""

from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    """Initialize database schema."""
    # Create all tables
    Base.metadata.create_all(bind=engine)


def seed_db(db: Session) -> None:
    """Seed initial data if needed."""
    # Add any initial data seeding logic here
    pass
