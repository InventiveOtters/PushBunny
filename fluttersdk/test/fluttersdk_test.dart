import 'package:flutter_test/flutter_test.dart';
import 'package:fluttersdk/fluttersdk.dart';
import 'package:fluttersdk/fluttersdk_platform_interface.dart';
import 'package:fluttersdk/fluttersdk_method_channel.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockFluttersdkPlatform
    with MockPlatformInterfaceMixin
    implements FluttersdkPlatform {

  @override
  Future<String?> getPlatformVersion() => Future.value('42');
}

void main() {
  final FluttersdkPlatform initialPlatform = FluttersdkPlatform.instance;

  test('$MethodChannelFluttersdk is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelFluttersdk>());
  });

  test('getPlatformVersion', () async {
    Fluttersdk fluttersdkPlugin = Fluttersdk();
    MockFluttersdkPlatform fakePlatform = MockFluttersdkPlatform();
    FluttersdkPlatform.instance = fakePlatform;

    expect(await fluttersdkPlugin.getPlatformVersion(), '42');
  });
}
