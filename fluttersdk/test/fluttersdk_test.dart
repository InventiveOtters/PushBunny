import 'package:flutter_test/flutter_test.dart';
import 'package:fluttersdk/fluttersdk.dart';

void main() {
  group('PushBunnyClient', () {
    test('creates NotificationRequest with correct parameters', () {
      final request = NotificationRequest(
        baseMessage: 'Test message',
        context: 'test',
        apiKey: 'test-key',
        intentId: 'test-intent',
        locale: 'en-US',
      );

      expect(request.baseMessage, 'Test message');
      expect(request.context, 'test');
      expect(request.apiKey, 'test-key');
      expect(request.intentId, 'test-intent');
      expect(request.locale, 'en-US');
    });

    test('NotificationRequest uses default locale', () {
      final request = NotificationRequest(
        baseMessage: 'Test message',
        context: 'test',
        apiKey: 'test-key',
      );

      expect(request.locale, 'en-US');
    });

    test('NotificationResponse contains required fields', () {
      final response = NotificationResponse(
        variantId: 'variant-123',
        resolvedMessage: 'Optimized message',
      );

      expect(response.variantId, 'variant-123');
      expect(response.resolvedMessage, 'Optimized message');
    });

    test('PushBunnyException formats correctly', () {
      final exception = PushBunnyException(
        code: 'TEST_ERROR',
        message: 'Test error message',
        details: 'Additional details',
      );

      expect(exception.code, 'TEST_ERROR');
      expect(exception.message, 'Test error message');
      expect(exception.details, 'Additional details');
      expect(exception.toString(), contains('TEST_ERROR'));
      expect(exception.toString(), contains('Test error message'));
    });
  });
}
