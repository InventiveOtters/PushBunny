"""
/v1/auth endpoint router.
Optional authentication for dashboard and API access.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets
import logging
from ..database import get_db
from ..schemas import LoginRequest, LoginResponse
from ..models import ApiKey

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/auth", tags=["auth"])


def generate_api_key() -> str:
    """Generate a secure API key."""
    return f"pbk_live_{secrets.token_urlsafe(32)}"


@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Login endpoint that returns an API key.
    
    NOTE: This is a simplified implementation for MVP.
    In production, implement proper password hashing and user management.
    
    Args:
        request: Login credentials
        db: Database session
        
    Returns:
        LoginResponse with generated API key
    """
    # SIMPLIFIED: In production, validate against user table with hashed passwords
    # For MVP, just generate an API key for any login
    
    try:
        # Check if user already has an API key
        existing_key = db.query(ApiKey).filter(ApiKey.owner == request.email).first()
        
        if existing_key:
            logger.info(f"Returning existing API key for {request.email}")
            return LoginResponse(api_key=existing_key.key)
        
        # Generate new API key
        api_key = generate_api_key()
        
        # Store in database
        db_api_key = ApiKey(
            key=api_key,
            owner=request.email
        )
        db.add(db_api_key)
        db.commit()
        
        logger.info(f"Generated new API key for {request.email}")
        
        return LoginResponse(api_key=api_key)
        
    except Exception as e:
        logger.error(f"Error during login: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


def verify_api_key(api_key: str, db: Session) -> bool:
    """
    Verify if an API key is valid.
    
    Args:
        api_key: API key to verify
        db: Database session
        
    Returns:
        True if valid, False otherwise
    """
    if not api_key:
        return False
    
    key_record = db.query(ApiKey).filter(ApiKey.key == api_key).first()
    return key_record is not None
