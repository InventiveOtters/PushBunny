"""
Configuration management for PushBunny backend.
Loads environment variables and provides centralized config access.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = "postgresql://user:password@localhost:5432/pushbunny"
    
    # n8n Integration
    n8n_url: str = "https://n8n.example.com/webhook/resolve"
    n8n_timeout: int = 10  # seconds
    
    # API Security
    api_key_secret: str = "change-me-in-production"
    
    # Application
    app_name: str = "PushBunnyBackend"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # CORS
    cors_origins: list[str] = ["*"]

    # A/B Testing (Thompson Sampling)
    ab_exploration_threshold: int = 50  # Min notifications before Thompson Sampling starts
    ab_exploration_rate: float = 0.1    # Probability to generate completely new variant
    ab_duplicate_retry_max: int = 3     # Max retries when AI generates duplicate message

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
