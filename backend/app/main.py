"""
PushBunny Backend - FastAPI entrypoint.
Main application setup and router registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from .config import get_settings
from .database import init_db
from .routers import resolve, metrics, variants, auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    logger.info("Starting PushBunny Backend...")
    logger.info("Initializing database...")
    init_db()
    logger.info("Database initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down PushBunny Backend...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-optimized push notification backend powered by n8n and Gemini",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resolve.router)
app.include_router(metrics.router)
app.include_router(variants.router)
app.include_router(auth.router)


@app.get("/")
def root():
    """Root endpoint - health check."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "message": "🐰 PushBunny Backend is running!"
    }


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
