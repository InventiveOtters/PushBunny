import 'package:flutter/services.dart';
import 'pushbunny_pigeon.dart';
import 'models.dart';

/// Exception thrown when PushBunny operations fail.
class PushBunnyException implements Exception {
  PushBunnyException({required this.code, required this.message, this.details});

  /// Error code (e.g., "NOTIFICATION_ERROR", "NETWORK_ERROR")
  final String code;

  /// Human-readable error message
  final String message;

  /// Additional error details
  final String? details;

  @override
  String toString() {
    if (details != null) {
      return 'PushBunnyException($code): $message\nDetails: $details';
    }
    return 'PushBunnyException($code): $message';
  }
}

/// Client for interacting with the PushBunny notification optimization service.
///
/// This client provides a clean API for generating optimized push notification
/// messages using AI-powered A/B testing.
///
/// Example:
/// ```dart
/// final client = PushBunnyClient();
///
/// try {
///   final response = await client.generateNotification(
///     baseMessage: 'Your package has arrived!',
///     context: 'delivery',
///     apiKey: 'your-api-key',
///   );
///   print('Notification: ${response.resolvedMessage}');
/// } on PushBunnyException catch (e) {
///   print('Error: ${e.message}');
/// }
/// ```
class PushBunnyClient {
  PushBunnyClient() : _api = PushBunnyApi();

  final PushBunnyApi _api;

  /// Generates an optimized notification message using the PushBunny backend.
  ///
  /// This method calls the native platform (Android/iOS) which in turn calls
  /// the Kotlin SDK's generateNotificationBody function.
  ///
  /// Parameters:
  /// - [request]: The notification request containing all required parameters
  ///
  /// Returns a [PushBunnyNotificationResponse] containing:
  /// - [resolvedMessage]: The optimized notification text
  /// - [variantId]: The variant ID used for A/B testing
  ///
  /// Throws [PushBunnyException] if the operation fails.
  Future<PushBunnyNotificationResponse> generateNotification(
    PushBunnyNotificationRequest request,
  ) async {
    try {
      final pigeonRequest = NotificationRequest(
        baseMessage: request.baseMessage,
        context: request.context,
        apiKey: request.apiKey,
        intentId: request.intentId,
        locale: request.locale,
      );

      final pigeonResponse = await _api.generateNotification(pigeonRequest);

      return PushBunnyNotificationResponse(
        variantId: pigeonResponse.variantId,
        resolvedMessage: pigeonResponse.resolvedMessage,
      );
    } on PlatformException catch (e) {
      throw PushBunnyException(
        code: e.code,
        message: e.message ?? 'Unknown error occurred',
        details: e.details?.toString(),
      );
    } catch (e) {
      throw PushBunnyException(code: 'UNKNOWN_ERROR', message: e.toString());
    }
  }

  /// Records a notification metric event to the PushBunny backend.
  ///
  /// This method tracks notification lifecycle events (sent, clicked) for A/B testing
  /// and analytics purposes. The backend uses these metrics to determine which notification
  /// variants perform best.
  ///
  /// This method calls the native platform (Android/iOS) which in turn calls
  /// the Kotlin SDK's recordMetric function.
  ///
  /// Parameters:
  /// - [request]: The metric request containing variantId, eventType, and optional timestamp
  ///
  /// Returns a [PushBunnyMetricResponse] containing:
  /// - [status]: Status of the metric recording (typically "ok")
  ///
  /// Throws [PushBunnyException] if the operation fails.
  ///
  /// Example:
  /// ```dart
  /// // Record a "sent" metric
  /// final response = await client.recordMetric(
  ///   PushBunnyMetricRequest(
  ///     variantId: 'a2f3c523-9240-4013-8e86-acf2600c6129',
  ///     eventType: 'sent',
  ///   ),
  /// );
  ///
  /// // Record a "clicked" metric with custom timestamp
  /// final response = await client.recordMetric(
  ///   PushBunnyMetricRequest(
  ///     variantId: 'a2f3c523-9240-4013-8e86-acf2600c6129',
  ///     eventType: 'clicked',
  ///     timestamp: '2025-02-15T12:01:12Z',
  ///   ),
  /// );
  /// ```
  Future<PushBunnyMetricResponse> recordMetric(
    PushBunnyMetricRequest request,
  ) async {
    try {
      final pigeonRequest = MetricRequest(
        variantId: request.variantId,
        eventType: request.eventType,
        timestamp: request.timestamp,
      );

      final pigeonResponse = await _api.recordMetric(pigeonRequest);

      return PushBunnyMetricResponse(status: pigeonResponse.status);
    } on PlatformException catch (e) {
      throw PushBunnyException(
        code: e.code,
        message: e.message ?? 'Unknown error occurred',
        details: e.details?.toString(),
      );
    } catch (e) {
      throw PushBunnyException(code: 'UNKNOWN_ERROR', message: e.toString());
    }
  }
}
