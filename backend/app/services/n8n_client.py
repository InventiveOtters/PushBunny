"""
n8n workflow client.
Sends notification intents to n8n for AI processing via Gemini.
"""

import httpx
import logging
from typing import Optional
from ..schemas import N8nRequest, N8nResponse
from ..config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class N8nClient:
    """Client for interacting with n8n workflow."""
    
    def __init__(self, url: Optional[str] = None, timeout: Optional[int] = None):
        self.url = url or settings.n8n_url
        self.timeout = timeout or settings.n8n_timeout
    
    async def resolve_intent(self, request: N8nRequest) -> N8nResponse:
        """
        Send intent to n8n workflow for AI processing.
        
        Args:
            request: Intent request data
            
        Returns:
            N8nResponse with variant_message and should_store_variant flag
            
        Raises:
            httpx.HTTPError: If n8n request fails
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    self.url,
                    json=request.model_dump(mode='json'),
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                
                data = response.json()
                logger.info(f"n8n response for intent {request.intent_id}: {data}")
                
                return N8nResponse(**data)
                
        except httpx.HTTPError as e:
            logger.error(f"n8n request failed: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error calling n8n: {e}")
            raise


# Singleton instance
n8n_client = N8nClient()
