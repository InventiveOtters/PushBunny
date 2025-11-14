"""Custom exception classes."""


class APIKeyException(Exception):
    """Exception raised for API key validation errors."""
    pass


class NotFoundException(Exception):
    """Exception raised when a resource is not found."""
    pass


class LLMServiceException(Exception):
    """Exception raised when LLM service fails."""
    pass
