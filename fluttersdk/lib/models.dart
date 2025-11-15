/// Public API models for PushBunny SDK
///
/// These models wrap the internal Pigeon-generated types to provide
/// a stable public API that won't break when Pigeon is updated.
library;

/// Request data for generating a notification.
class PushBunnyNotificationRequest {
  const PushBunnyNotificationRequest({
    required this.baseMessage,
    required this.context,
    required this.apiKey,
    this.intentId,
    this.locale = 'en-US',
  });

  /// The fallback message if AI fails
  final String baseMessage;

  /// Additional context data about the base_message (e.g., "delivery", "messaging")
  final String context;

  /// The API key for authentication
  final String apiKey;

  /// Intent identifier from SDK (optional, will be generated if not provided)
  final String? intentId;

  /// User locale (defaults to "en-US")
  final String locale;
}

/// Response data from notification generation.
class PushBunnyNotificationResponse {
  const PushBunnyNotificationResponse({
    required this.variantId,
    required this.resolvedMessage,
  });

  /// The variant ID used for A/B testing
  final String variantId;

  /// The optimized notification message
  final String resolvedMessage;
}
