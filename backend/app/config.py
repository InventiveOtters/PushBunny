"""Application configuration management."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    DATABASE_URL: str
    
    # API Keys (comma-separated)
    API_KEYS: str
    
    # Gemini API
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-1.5-flash"
    
    # Application
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # API
    API_V1_PREFIX: str = "/v1"
    PROJECT_NAME: str = "PushBunny"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True
    )
    
    @property
    def api_keys_list(self) -> List[str]:
        """Parse comma-separated API keys into a list."""
        return [key.strip() for key in self.API_KEYS.split(",") if key.strip()]


# Global settings instance
settings = Settings()
