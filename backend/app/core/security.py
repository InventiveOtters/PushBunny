"""Security utilities for API key validation."""

from typing import Optional
from app.config import settings
from app.core.exceptions import APIKeyException


def verify_api_key(api_key: Optional[str]) -> bool:
    """
    Verify if the provided API key is valid.
    
    Args:
        api_key: The API key to verify
        
    Returns:
        True if valid, raises APIKeyException otherwise
        
    Raises:
        APIKeyException: If API key is missing or invalid
    """
    if not api_key:
        raise APIKeyException("API key is required")
    
    # Remove "Bearer " prefix if present
    if api_key.startswith("Bearer "):
        api_key = api_key[7:]
    
    valid_keys = settings.api_keys_list
    
    if api_key not in valid_keys:
        raise APIKeyException("Invalid API key")
    
    return True


def hash_api_key(key: str) -> str:
    """
    Hash an API key for storage.
    
    For MVP, we store keys in environment variables.
    This function is for future use when API key management is implemented.
    
    Args:
        key: The API key to hash
        
    Returns:
        Hashed API key
    """
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(key)
