#!/usr/bin/env python3
"""
Database initialization script.
Creates all tables and optionally seeds initial data.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, Base
from app.models import Variant, Metric, ApiKey


def init_database():
    """Initialize database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    init_database()
