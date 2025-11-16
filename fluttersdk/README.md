# 🐰 PushBunny Flutter SDK

[![Flutter](https://img.shields.io/badge/flutter-3.0+-blue.svg)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/dart-3.0+-blue.svg)](https://dart.dev)
[![Platform](https://img.shields.io/badge/platform-android%20%7C%20ios-lightgrey.svg)](https://flutter.dev)

AI-powered push notification optimization SDK for Flutter. Automatically A/B tests and optimizes your notification messages using Thompson Sampling (Bayesian multi-armed bandit).

## 🎯 What is PushBunny?

PushBunny is an AI-powered notification optimization service that:
- 🤖 **Generates AI-optimized notification variants** using Google Gemini
- 📊 **Automatically A/B tests** messages using Thompson Sampling
- 🎯 **Per-intent optimization** - each notification type learns independently
- 🔧 **Zero configuration** - works out of the box
- 📱 **Cross-platform** - works on Android and iOS

## 📦 Installation

Add this to your package's `pubspec.yaml` file:

```yaml
dependencies:
  fluttersdk:
    path: ../fluttersdk  # Or use git/pub.dev when published
```

Then run:

```bash
flutter pub get
```

## 🚀 Quick Start

### 1. Import the SDK

```dart
import 'package:fluttersdk/fluttersdk.dart';
```

### 2. Generate an Optimized Notification

```dart
// Create client
final client = PushBunnyClient();

try {
  // Generate optimized notification
  final response = await client.generateNotification(
    PushBunnyNotificationRequest(
      baseMessage: 'Your order has shipped!',
      context: 'order_shipped',
      apiKey: 'your-api-key',
      intentId: 'order_shipped',  // Groups similar notifications
      locale: 'en-US',
    ),
  );

  // Show the notification
  print('Optimized message: ${response.resolvedMessage}');
  print('Variant ID: ${response.variantId}');
} on PushBunnyException catch (e) {
  print('Error: ${e.message}');
}
```

### 3. Track Notification Metrics

Track when notifications are sent and clicked to enable A/B testing:

```dart
// Track when notification is sent
await client.recordMetric(
  PushBunnyMetricRequest(
    variantId: response.variantId,
    eventType: 'sent',
  ),
);

// Track when user clicks the notification
await client.recordMetric(
  PushBunnyMetricRequest(
    variantId: response.variantId,
    eventType: 'clicked',
  ),
);
```

## 📖 API Reference

### `PushBunnyClient`

The main client for interacting with the PushBunny service.

#### `generateNotification(PushBunnyNotificationRequest request)`

Generates an AI-optimized notification message.

**Parameters:**
- `request` - The notification request containing:
  - `baseMessage` (String, required) - The fallback message if AI fails
  - `context` (String, required) - Additional context about the notification
  - `apiKey` (String, required) - Your PushBunny API key
  - `intentId` (String, optional) - Intent identifier for grouping similar notifications
  - `locale` (String, optional) - User locale (defaults to "en-US")

**Returns:** `Future<PushBunnyNotificationResponse>`
- `resolvedMessage` - The optimized notification text
- `variantId` - The variant ID for tracking metrics

**Throws:** `PushBunnyException` if the request fails

**Example:**
```dart
final response = await client.generateNotification(
  PushBunnyNotificationRequest(
    baseMessage: 'Your package has arrived!',
    context: 'delivery',
    apiKey: 'your-api-key',
    intentId: 'delivery_notification',
    locale: 'en-US',
  ),
);
```

#### `recordMetric(PushBunnyMetricRequest request)`

Records a notification metric event for A/B testing and analytics.

**Parameters:**
- `request` - The metric request containing:
  - `variantId` (String, required) - The variant ID from `generateNotification()`
  - `eventType` (String, required) - Event type: "sent" or "clicked"
  - `timestamp` (String, optional) - ISO 8601 timestamp (defaults to current time)

**Returns:** `Future<PushBunnyMetricResponse>`
- `status` - Status of the operation (typically "ok")

**Throws:** `PushBunnyException` if the request fails

**Example:**
```dart
await client.recordMetric(
  PushBunnyMetricRequest(
    variantId: response.variantId,
    eventType: 'sent',
  ),
);
```

### Exception Handling

The SDK throws `PushBunnyException` for errors:

```dart
try {
  final response = await client.generateNotification(request);
} on PushBunnyException catch (e) {
  print('Error code: ${e.code}');
  print('Error message: ${e.message}');
  print('Error details: ${e.details}');
}
```

## 💡 Usage Examples

### Complete Notification Flow

```dart
import 'package:fluttersdk/fluttersdk.dart';

class NotificationService {
  final _client = PushBunnyClient();

  Future<void> sendOrderShippedNotification(String orderId) async {
    try {
      // 1. Generate optimized message
      final response = await _client.generateNotification(
        PushBunnyNotificationRequest(
          baseMessage: 'Your order #$orderId has shipped!',
          context: 'order_shipped',
          apiKey: 'your-api-key',
          intentId: 'order_shipped',
          locale: 'en-US',
        ),
      );

      // 2. Show notification to user
      await _showLocalNotification(
        title: 'Order Update',
        body: response.resolvedMessage,
        payload: response.variantId,
      );

      // 3. Track that notification was sent
      await _client.recordMetric(
        PushBunnyMetricRequest(
          variantId: response.variantId,
          eventType: 'sent',
        ),
      );

      // 4. Track click when user taps notification
      _onNotificationTapped((variantId) async {
        await _client.recordMetric(
          PushBunnyMetricRequest(
            variantId: variantId,
            eventType: 'clicked',
          ),
        );
      });

    } on PushBunnyException catch (e) {
      print('PushBunny error: ${e.message}');
      // Fallback to base message
      await _showLocalNotification(
        title: 'Order Update',
        body: 'Your order #$orderId has shipped!',
      );
    }
  }
}
```

### Multiple Notification Types

```dart
class NotificationManager {
  final _client = PushBunnyClient();

  // Each intent_id optimizes independently
  Future<void> sendNotifications() async {
    // Order shipped notifications
    final orderResponse = await _client.generateNotification(
      PushBunnyNotificationRequest(
        baseMessage: 'Your order has shipped!',
        context: 'order_shipped',
        apiKey: 'your-api-key',
        intentId: 'order_shipped',  // Learns what works for shipping
      ),
    );

    // Payment failed notifications
    final paymentResponse = await _client.generateNotification(
      PushBunnyNotificationRequest(
        baseMessage: 'Payment failed',
        context: 'payment_failed',
        apiKey: 'your-api-key',
        intentId: 'payment_failed',  // Learns what works for payments
      ),
    );

    // Welcome notifications
    final welcomeResponse = await _client.generateNotification(
      PushBunnyNotificationRequest(
        baseMessage: 'Welcome to our app!',
        context: 'welcome_new_user',
        apiKey: 'your-api-key',
        intentId: 'welcome_new_user',  // Learns what works for onboarding
      ),
    );
  }
}
```

### Error Handling with Fallback

```dart
Future<String> getOptimizedMessage(String baseMessage, String context) async {
  try {
    final response = await client.generateNotification(
      PushBunnyNotificationRequest(
        baseMessage: baseMessage,
        context: context,
        apiKey: 'your-api-key',
      ),
    );
    return response.resolvedMessage;
  } on PushBunnyException catch (e) {
    // Log error and return fallback
    print('PushBunny error: ${e.message}');
    return baseMessage;  // Use base message as fallback
  }
}
```

## 🎯 Understanding Intent IDs

The `intentId` parameter is crucial for optimization. It groups similar notifications together so the AI can learn what works for each specific context.

### Best Practices

✅ **DO:**
- Use descriptive, consistent intent IDs: `"order_shipped"`, `"payment_failed"`, `"welcome_new_user"`
- Group similar notifications under the same intent ID
- Use different intent IDs for different notification contexts

❌ **DON'T:**
- Use random or unique intent IDs for each notification
- Mix different notification types under the same intent ID
- Use user-specific data in intent IDs (e.g., `"order_shipped_user123"`)

### Examples

```dart
// ✅ GOOD: Consistent intent IDs
await client.generateNotification(
  PushBunnyNotificationRequest(
    baseMessage: 'Order #12345 shipped',
    context: 'order_shipped',
    apiKey: 'your-api-key',
    intentId: 'order_shipped',  // Same for all order shipped notifications
  ),
);

await client.generateNotification(
  PushBunnyNotificationRequest(
    baseMessage: 'Order #67890 shipped',
    context: 'order_shipped',
    apiKey: 'your-api-key',
    intentId: 'order_shipped',  // Same intent ID
  ),
);

// ❌ BAD: Unique intent IDs
await client.generateNotification(
  PushBunnyNotificationRequest(
    baseMessage: 'Order #12345 shipped',
    context: 'order_shipped',
    apiKey: 'your-api-key',
    intentId: 'order_shipped_12345',  // Don't include order ID
  ),
);
```

## 🔧 Configuration

### Backend URL

By default, the SDK connects to `http://localhost:8080`. To use a different backend, configure it in the native platform code:

**Android** (`android/src/main/kotlin/.../FluttersdkPlugin.kt`):
```kotlin
// Modify the backend URL in the Kotlin SDK configuration
```

**iOS** (`ios/Classes/FluttersdkPlugin.swift`):
```swift
// Modify the backend URL in the Swift configuration
```

### API Key Storage

Store your API key securely:

```dart
// Use flutter_secure_storage or similar
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();

// Store API key
await storage.write(key: 'pushbunny_api_key', value: 'your-api-key');

// Retrieve API key
final apiKey = await storage.read(key: 'pushbunny_api_key');
```

## 📊 How Thompson Sampling Works

PushBunny uses **Thompson Sampling**, a Bayesian multi-armed bandit algorithm, to optimize notifications:

### Per-Intent Optimization

Each `intentId` has its own optimization state:

```
Intent: 'order_shipped'
├── Variant A: "Your order has shipped! 📦" (100 sends, 30 clicks → 30% CTR)
├── Variant B: "Package on the way 🚚" (100 sends, 45 clicks → 45% CTR)
└── Thompson Sampling: Picks B most often (better CTR)

Intent: 'payment_failed'
├── Variant A: "Payment failed" (100 sends, 15 clicks → 15% CTR)
├── Variant B: "Payment issue detected" (100 sends, 35 clicks → 35% CTR)
└── Thompson Sampling: Picks B most often (better CTR)
```

### Learning Phases

1. **Exploration (< 50 notifications)**: Generates new AI variants to build a diverse pool
2. **Optimization (≥ 50 notifications)**: Uses Thompson Sampling to pick best variants
3. **Continuous Learning**: Occasionally generates new variants (10% of the time)

## 🧪 Example App

See the complete example app in `example/` that demonstrates:
- SDK initialization
- Generating notifications
- Tracking metrics
- Handling user interactions
- Error handling

Run it:
```bash
cd example
flutter pub get
flutter run
```

## 🔍 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `PlatformException: NOTIFICATION_ERROR` | Backend unreachable | Check backend URL and ensure it's running |
| `Invalid API key` | Wrong API key | Verify your API key is correct |
| `Network error` | No internet connection | Check device network connectivity |
| `Timeout` | Backend slow to respond | Increase timeout or check backend performance |

### Debug Mode

Enable debug logging:

```dart
// Add logging to see what's happening
import 'dart:developer' as developer;

try {
  final response = await client.generateNotification(request);
  developer.log('Success: ${response.resolvedMessage}');
} on PushBunnyException catch (e) {
  developer.log('Error: ${e.message}', error: e);
}
```

## 📚 Additional Resources

- **Kotlin SDK**: See `sdk/README.md` for the underlying Kotlin Multiplatform SDK
- **Backend Documentation**: See `backend/README.md` for backend setup
- **Thompson Sampling**: See `backend/THOMPSON_SAMPLING.md` for algorithm details
- **A/B Testing Guide**: See `backend/AB_TESTING.md` for optimization guide

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/InventiveOtters/PushBunny/issues)
- **Documentation**: [Full Documentation](https://github.com/InventiveOtters/PushBunny)

## 🎉 Acknowledgments

- Built with [Flutter](https://flutter.dev)
- Uses [Kotlin Multiplatform SDK](https://kotlinlang.org/docs/multiplatform.html) under the hood
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Thompson Sampling algorithm based on Bayesian optimization research

---

Made with ❤️ for better push notifications
