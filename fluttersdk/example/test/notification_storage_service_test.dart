import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fluttersdk_example/services/notification_storage_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final service = NotificationStorageService.instance;
    await service.initialize();
    await service.clearNotifications();
  });

  group('NotificationStorageService', () {
    test('should save and retrieve notification data', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Your package has arrived!',
        variantId: 'variant-123',
      );

      final notifications = await service.getNotifications();
      expect(notifications['Your package has arrived!'], equals('variant-123'));
    });

    test('should retrieve variant ID by resolved message', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Order shipped',
        variantId: 'variant-456',
      );

      final variantId = await service.getVariantId('Order shipped');
      expect(variantId, equals('variant-456'));
    });

    test('should store multiple notifications', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Message 1',
        variantId: 'variant-1',
      );

      await service.saveNotification(
        resolvedMessage: 'Message 2',
        variantId: 'variant-2',
      );

      final notifications = await service.getNotifications();
      expect(notifications.length, equals(2));
      expect(notifications['Message 1'], equals('variant-1'));
      expect(notifications['Message 2'], equals('variant-2'));
    });

    test('should return correct notification count', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Message 1',
        variantId: 'variant-1',
      );

      await service.saveNotification(
        resolvedMessage: 'Message 2',
        variantId: 'variant-2',
      );

      final count = await service.getNotificationCount();
      expect(count, equals(2));
    });

    test('should clear all notifications', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Message 1',
        variantId: 'variant-1',
      );

      await service.clearNotifications();

      final notifications = await service.getNotifications();
      expect(notifications.isEmpty, isTrue);
    });

    test('should return empty map when no notifications exist', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      final notifications = await service.getNotifications();
      expect(notifications.isEmpty, isTrue);
    });

    test('should return null when variant ID not found', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      final variantId = await service.getVariantId('Non-existent message');
      expect(variantId, isNull);
    });

    test('should update variant ID for existing message', () async {
      final service = NotificationStorageService.instance;
      await service.initialize();

      await service.saveNotification(
        resolvedMessage: 'Message 1',
        variantId: 'variant-old',
      );

      await service.saveNotification(
        resolvedMessage: 'Message 1',
        variantId: 'variant-new',
      );

      final variantId = await service.getVariantId('Message 1');
      expect(variantId, equals('variant-new'));
    });
  });
}
