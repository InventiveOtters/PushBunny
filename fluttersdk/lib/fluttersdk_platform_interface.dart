import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'fluttersdk_method_channel.dart';

abstract class FluttersdkPlatform extends PlatformInterface {
  /// Constructs a FluttersdkPlatform.
  FluttersdkPlatform() : super(token: _token);

  static final Object _token = Object();

  static FluttersdkPlatform _instance = MethodChannelFluttersdk();

  /// The default instance of [FluttersdkPlatform] to use.
  ///
  /// Defaults to [MethodChannelFluttersdk].
  static FluttersdkPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [FluttersdkPlatform] when
  /// they register themselves.
  static set instance(FluttersdkPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> getPlatformVersion() {
    throw UnimplementedError('platformVersion() has not been implemented.');
  }
}
