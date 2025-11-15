import 'package:flutter/material.dart';
import 'package:fluttersdk/fluttersdk.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _client = PushBunnyClient();
  final _baseMessageController = TextEditingController(
    text: 'Your package has arrived!',
  );
  final _contextController = TextEditingController(text: 'delivery');
  final _apiKeyController = TextEditingController(text: 'your-api-key-here');

  String _result = '';
  bool _isLoading = false;

  @override
  void dispose() {
    _baseMessageController.dispose();
    _contextController.dispose();
    _apiKeyController.dispose();
    super.dispose();
  }

  Future<void> _generateNotification() async {
    setState(() {
      _isLoading = true;
      _result = '';
    });

    try {
      final response = await _client.generateNotification(
        baseMessage: _baseMessageController.text,
        context: _contextController.text,
        apiKey: _apiKeyController.text,
        locale: 'en-US',
      );

      setState(() {
        _result =
            'Success!\n\n'
            'Optimized Message:\n${response.resolvedMessage}\n\n'
            'Variant ID: ${response.variantId}';
        _isLoading = false;
      });
    } on PushBunnyException catch (e) {
      setState(() {
        _result = 'Error: ${e.message}\nCode: ${e.code}';
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _result = 'Unexpected error: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('PushBunny Example')),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Generate Optimized Notification',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _baseMessageController,
                decoration: const InputDecoration(
                  labelText: 'Base Message',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _contextController,
                decoration: const InputDecoration(
                  labelText: 'Context',
                  border: OutlineInputBorder(),
                  hintText: 'e.g., delivery, messaging, social',
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _apiKeyController,
                decoration: const InputDecoration(
                  labelText: 'API Key',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _isLoading ? null : _generateNotification,
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Generate Notification'),
              ),
              const SizedBox(height: 24),
              if (_result.isNotEmpty)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _result.startsWith('Success')
                        ? Colors.green.shade50
                        : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _result.startsWith('Success')
                          ? Colors.green
                          : Colors.red,
                    ),
                  ),
                  child: Text(_result, style: const TextStyle(fontSize: 14)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
