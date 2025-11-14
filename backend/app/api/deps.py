"""API dependencies for dependency injection."""

from typing import Generator
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import verify_api_key
from app.core.exceptions import APIKeyException


# HTTP Bearer token scheme
security = HTTPBearer()


def get_current_api_key(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> str:
    """
    Dependency to validate API key from Authorization header.
    
    Usage:
        @app.get("/endpoint")
        def endpoint(api_key: str = Depends(get_current_api_key)):
            ...
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        The validated API key
        
    Raises:
        HTTPException: If API key is invalid
    """
    try:
        verify_api_key(credentials.credentials)
        return credentials.credentials
    except APIKeyException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_db_session() -> Generator[Session, None, None]:
    """
    Dependency to get database session.
    
    This is a wrapper around get_db() for clarity.
    """
    yield from get_db()
