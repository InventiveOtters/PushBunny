
import 'fluttersdk_platform_interface.dart';

class Fluttersdk {
  Future<String?> getPlatformVersion() {
    return FluttersdkPlatform.instance.getPlatformVersion();
  }
}
