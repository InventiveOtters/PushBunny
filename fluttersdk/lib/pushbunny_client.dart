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
}
