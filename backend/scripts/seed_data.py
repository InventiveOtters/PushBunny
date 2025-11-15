#!/usr/bin/env python3
"""
Seed database with sample data for testing.
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models import Variant, Metric, ApiKey


def seed_database():
    """Seed database with sample data."""
    db = SessionLocal()
    
    try:
        print("Seeding database with sample data...")
        
        # Create sample variants
        variants = [
            Variant(
                intent_id="cart_abandon",
                message="You left something in your cart!",
                locale="en-US"
            ),
            Variant(
                intent_id="cart_abandon",
                message="Still thinking it over? Your headphones are waiting for you 🎧",
                locale="en-US"
            ),
            Variant(
                intent_id="cart_abandon",
                message="Don't miss out! Complete your purchase now.",
                locale="en-US"
            ),
            Variant(
                intent_id="price_drop",
                message="Great news! The price dropped on an item you viewed.",
                locale="en-US"
            ),
        ]
        
        for variant in variants:
            db.add(variant)
        
        db.commit()
        print(f"✅ Created {len(variants)} sample variants")
        
        # Create sample metrics
        base_time = datetime.utcnow() - timedelta(days=7)
        metrics = []
        
        for i, variant in enumerate(variants[:3]):  # Only for cart_abandon variants
            for j in range(20):
                # Sent metric
                metrics.append(Metric(
                    user_id=f"user_{j}",
                    intent_id="cart_abandon",
                    variant_id=variant.id,
                    event_type="sent",
                    timestamp=base_time + timedelta(hours=j)
                ))
                
                # Some opened
                if j % 3 == i:
                    metrics.append(Metric(
                        user_id=f"user_{j}",
                        intent_id="cart_abandon",
                        variant_id=variant.id,
                        event_type="opened",
                        timestamp=base_time + timedelta(hours=j, minutes=5)
                    ))
                    
                    # Some clicked
                    if j % 6 == i:
                        metrics.append(Metric(
                            user_id=f"user_{j}",
                            intent_id="cart_abandon",
                            variant_id=variant.id,
                            event_type="clicked",
                            timestamp=base_time + timedelta(hours=j, minutes=10)
                        ))
        
        for metric in metrics:
            db.add(metric)
        
        db.commit()
        print(f"✅ Created {len(metrics)} sample metrics")
        
        # Create sample API key
        api_key = ApiKey(
            key="pbk_test_demo_key_12345",
            owner="demo@pushbunny.com"
        )
        db.add(api_key)
        db.commit()
        print("✅ Created demo API key: pbk_test_demo_key_12345")
        
        print("\n🎉 Database seeded successfully!")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
