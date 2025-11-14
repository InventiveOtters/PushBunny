"""Main v1 API router."""

from fastapi import APIRouter

from app.api.v1 import message, events, stats

api_router = APIRouter()

# Include sub-routers
api_router.include_router(message.router, tags=["message"])
api_router.include_router(events.router, tags=["events"])
api_router.include_router(stats.router, tags=["stats"])
