"""Tracking token generation utilities."""

import uuid
import secrets


def generate_tracking_token() -> str:
    """
    Generate a unique tracking token for impression tracking.
    
    Returns:
        A unique tracking token string
    """
    # Use a combination of timestamp and random for uniqueness
    return f"trk_{uuid.uuid4().hex[:16]}_{secrets.token_hex(8)}"


def generate_variant_id() -> str:
    """
    Generate a unique variant ID.
    
    Returns:
        A unique variant ID string
    """
    return f"var_{uuid.uuid4().hex[:12]}"


def generate_experiment_id() -> str:
    """
    Generate a unique experiment ID.
    
    Returns:
        A unique experiment ID string
    """
    return f"exp_{uuid.uuid4().hex[:12]}"
