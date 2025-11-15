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

/// Request data for recording a metric event.
class PushBunnyMetricRequest {
  const PushBunnyMetricRequest({
    required this.variantId,
    required this.eventType,
    this.timestamp,
  });

  /// The variant ID returned from generateNotification
  final String variantId;

  /// The type of event: "sent" or "clicked"
  final String eventType;

  /// Optional ISO 8601 timestamp (defaults to current time if not provided)
  final String? timestamp;
}

/// Response data from metric recording.
class PushBunnyMetricResponse {
  const PushBunnyMetricResponse({required this.status});

  /// Status of the metric recording (typically "ok")
  final String status;
}
