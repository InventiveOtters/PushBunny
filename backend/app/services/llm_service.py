"""LLM service for generating message variants using Gemini API."""

from typing import List
import google.generativeai as genai
from app.config import settings
from app.schemas.notification_intent import NotificationIntent
from app.core.exceptions import LLMServiceException


class LLMService:
    """Service for generating message variants using Gemini API."""
    
    def __init__(self):
        """Initialize the LLM service with Gemini API."""
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    def generate_variants(
        self, 
        intent: NotificationIntent, 
        count: int = 3
    ) -> List[str]:
        """
        Generate message variants for a notification intent.
        
        Args:
            intent: The notification intent
            count: Number of variants to generate
            
        Returns:
            List of generated message texts
            
        Raises:
            LLMServiceException: If generation fails
        """
        try:
            # Build prompt
            prompt = self._build_prompt(intent, count)
            
            # Generate variants
            response = self.model.generate_content(prompt)
            
            # Parse response - expecting numbered list
            variants = self._parse_variants(response.text, count)
            
            return variants
            
        except Exception as e:
            raise LLMServiceException(f"Failed to generate variants: {str(e)}")
    
    def _build_prompt(self, intent: NotificationIntent, count: int) -> str:
        """Build the prompt for variant generation."""
        context_str = "\n".join([f"- {k}: {v}" for k, v in intent.context.items()])
        
        prompt = f"""Generate {count} different push notification messages for the following intent:

Intent ID: {intent.intent_id}
Base Example: {intent.base_example}
Locale: {intent.locale or 'en-US'}

Context:
{context_str if context_str else 'No additional context'}

Requirements:
- Each message should be concise (under 100 characters)
- Use engaging, actionable language
- Vary the tone and approach
- Focus on user value
- Return only the messages, one per line, numbered 1-{count}

Example format:
1. [First message]
2. [Second message]
3. [Third message]
"""
        return prompt
    
    def _parse_variants(self, response_text: str, count: int) -> List[str]:
        """Parse the generated variants from response text."""
        lines = response_text.strip().split('\n')
        variants = []
        
        for line in lines:
            # Remove numbering (e.g., "1. ", "2. ", etc.)
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith('-')):
                # Remove leading number/dash and period/space
                parts = line.split('.', 1) if '.' in line else line.split(' ', 1)
                if len(parts) > 1:
                    variant = parts[1].strip()
                    if variant:
                        variants.append(variant)
            elif line:  # Handle non-numbered lines
                variants.append(line)
        
        # Ensure we have exactly 'count' variants
        if len(variants) < count:
            # If we got fewer, duplicate the base example
            while len(variants) < count:
                variants.append(intent.base_example)
        
        return variants[:count]
