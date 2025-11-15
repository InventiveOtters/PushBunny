import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class NotificationStorageService {
  static const String _storageKey = 'pushbunny_notifications';
  
  static NotificationStorageService? _instance;
  SharedPreferences? _prefs;

  NotificationStorageService._();

  static NotificationStorageService get instance {
    _instance ??= NotificationStorageService._();
    return _instance!;
  }

  Future<void> initialize() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  Future<void> saveNotification({
    required String resolvedMessage,
    required String variantId,
  }) async {
    if (_prefs == null) {
      await initialize();
    }

    final notifications = await getNotifications();
    notifications[resolvedMessage] = variantId;

    final jsonString = jsonEncode(notifications);
    await _prefs!.setString(_storageKey, jsonString);
  }

  Future<Map<String, String>> getNotifications() async {
    if (_prefs == null) {
      await initialize();
    }

    final jsonString = _prefs!.getString(_storageKey);
    if (jsonString == null || jsonString.isEmpty) {
      return {};
    }

    try {
      final decoded = jsonDecode(jsonString) as Map<String, dynamic>;
      return decoded.map((key, value) => MapEntry(key, value.toString()));
    } catch (e) {
      return {};
    }
  }

  Future<String?> getVariantId(String resolvedMessage) async {
    final notifications = await getNotifications();
    return notifications[resolvedMessage];
  }

  Future<void> clearNotifications() async {
    if (_prefs == null) {
      await initialize();
    }
    await _prefs!.remove(_storageKey);
  }

  Future<int> getNotificationCount() async {
    final notifications = await getNotifications();
    return notifications.length;
  }
}

