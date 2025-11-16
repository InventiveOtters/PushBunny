import 'package:flutter/material.dart';
import 'package:fluttersdk/fluttersdk.dart';
import '../services/notification_service.dart';
import '../services/notification_storage_service.dart';

class NotificationViewModel extends ChangeNotifier {
  final PushBunnyClient _client = PushBunnyClient();
  final NotificationService _notificationService = NotificationService();
  final NotificationStorageService _storageService =
      NotificationStorageService.instance;

  String _result = '';
  bool _isLoading = false;

  String get result => _result;
  bool get isLoading => _isLoading;

  Future<void> initialize() async {
    await _notificationService.initialize(
      onNotificationTapped: _handleNotificationTap,
    );
    await _notificationService.requestPermissions();
    await _storageService.initialize();
  }

  Future<void> _handleNotificationTap(String? payload) async {
    if (payload == null) return;

    final variantId = await _storageService.getVariantId(payload);
    if (variantId == null) return;

    try {
      await _client.recordMetric(
        PushBunnyMetricRequest(variantId: variantId, eventType: 'clicked'),
      );
      debugPrint('Recorded "clicked" metric for variant: $variantId');
    } on PushBunnyException catch (e) {
      debugPrint('Failed to record clicked metric: ${e.message}');
    }
  }

  Future<void> generateNotification(String baseMessage) async {
    _isLoading = true;
    _result = '';
    notifyListeners();

    try {
      final request = PushBunnyNotificationRequest(
        baseMessage: baseMessage,
        context: 'general',
        apiKey: 'your-api-key-here',
        locale: 'en-US',
        intentId: "TestPushNotification",
      );

      final response = await _client.generateNotification(request);

      await _storageService.saveNotification(
        resolvedMessage: response.resolvedMessage,
        variantId: response.variantId,
      );

      await _notificationService.showNotification(
        title: 'PushBunny',
        body: response.resolvedMessage,
        payload: response.resolvedMessage,
      );

      try {
        await _client.recordMetric(
          PushBunnyMetricRequest(
            variantId: response.variantId,
            eventType: 'sent',
          ),
        );
        debugPrint('Recorded "sent" metric for variant: ${response.variantId}');
      } on PushBunnyException catch (e) {
        debugPrint('Failed to record sent metric: ${e.message}');
      }

      _result =
          'Success!\n\n'
          'Notification Sent!\n\n'
          'Optimized Message:\n${response.resolvedMessage}\n\n'
          'Variant ID: ${response.variantId}';
      _isLoading = false;
      notifyListeners();
    } on PushBunnyException catch (e) {
      _result = 'Error: ${e.message}\nCode: ${e.code}';
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _result = 'Unexpected error: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearResult() {
    _result = '';
    notifyListeners();
  }
}
