// Copyright 2025 PushBunny. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import 'package:pigeon/pigeon.dart';

@ConfigurePigeon(
  PigeonOptions(
    dartOut: 'lib/pushbunny_pigeon.dart',
    dartOptions: DartOptions(),
    kotlinOut:
        'android/src/main/kotlin/com/inotter/pushbunnyflutter/fluttersdk/PushBunnyPigeon.kt',
    kotlinOptions: KotlinOptions(
      package: 'com.inotter.pushbunnyflutter.fluttersdk',
    ),
    swiftOut: 'ios/Classes/PushBunnyPigeon.swift',
    swiftOptions: SwiftOptions(),
  ),
)
/// Request data for generating a notification.
/// Maps to the Kotlin SDK's NotificationRequest model.
class NotificationRequest {
  NotificationRequest({
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
/// Maps to the Kotlin SDK's NotificationResponse model.
class NotificationResponse {
  NotificationResponse({
    required this.variantId,
    required this.resolvedMessage,
  });

  /// The variant ID used for A/B testing
  final String variantId;

  /// The optimized notification message
  final String resolvedMessage;
}

/// Request data for recording a metric event.
/// Maps to the Kotlin SDK's MetricRequest model.
class MetricRequest {
  MetricRequest({
    required this.variantId,
    required this.eventType,
    this.timestamp,
  });

  /// The variant ID returned from generateNotificationBody
  final String variantId;

  /// The type of event: "sent" or "clicked"
  final String eventType;

  /// Optional ISO 8601 timestamp (defaults to current time if not provided)
  final String? timestamp;
}

/// Response data from metric recording.
/// Maps to the Kotlin SDK's MetricResponse model.
class MetricResponse {
  MetricResponse({required this.status});

  /// Status of the metric recording (typically "ok")
  final String status;
}

/// Error information for PushBunny operations.
class PushBunnyError {
  PushBunnyError({required this.code, required this.message, this.details});

  /// Error code (e.g., "NETWORK_ERROR", "API_ERROR", "INVALID_REQUEST")
  final String code;

  /// Human-readable error message
  final String message;

  /// Additional error details (optional)
  final String? details;
}

/// Host API for PushBunny operations.
/// This interface is implemented on the native platform (Android/iOS)
/// and called from Dart.
@HostApi()
abstract class PushBunnyApi {
  /// Generates an optimized notification message using the PushBunny backend.
  ///
  /// This method calls the Kotlin SDK's generateNotificationBody function.
  ///
  /// Throws a PlatformException on error with details from PushBunnyError.
  @async
  NotificationResponse generateNotification(NotificationRequest request);

  /// Records a notification metric event to the PushBunny backend.
  ///
  /// This method tracks notification lifecycle events (sent, clicked) for A/B testing
  /// and analytics purposes. The backend uses these metrics to determine which notification
  /// variants perform best.
  ///
  /// This method calls the Kotlin SDK's recordMetric function.
  ///
  /// Throws a PlatformException on error with details from PushBunnyError.
  @async
  MetricResponse recordMetric(MetricRequest request);
}
