import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'fluttersdk_platform_interface.dart';

/// An implementation of [FluttersdkPlatform] that uses method channels.
class MethodChannelFluttersdk extends FluttersdkPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('fluttersdk');

  @override
  Future<String?> getPlatformVersion() async {
    final version = await methodChannel.invokeMethod<String>('getPlatformVersion');
    return version;
  }
}
