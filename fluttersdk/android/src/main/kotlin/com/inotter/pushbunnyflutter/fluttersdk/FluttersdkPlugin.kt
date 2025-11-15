package com.inotter.pushbunnyflutter.fluttersdk

import api.generateNotificationBody
import api.recordMetric
import io.flutter.embedding.engine.plugins.FlutterPlugin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kotlinx.datetime.Clock
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

/** FluttersdkPlugin - PushBunny Flutter SDK Plugin */
class FluttersdkPlugin : FlutterPlugin, PushBunnyApi {
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        PushBunnyApi.setUp(flutterPluginBinding.binaryMessenger, this)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        PushBunnyApi.setUp(binding.binaryMessenger, null)
        scope.cancel()
    }

    @OptIn(ExperimentalUuidApi::class)
    override fun generateNotification(
        request: NotificationRequest,
        callback: (Result<NotificationResponse>) -> Unit
    ) {
        scope.launch {
            try {
                val response = generateNotificationBody(
                    baseMessage = request.baseMessage,
                    context = request.context,
                    apiKey = request.apiKey,
                    intentId = request.intentId ?: Uuid.random().toString(),
                    locale = request.locale
                )

                val pigeonResponse = NotificationResponse(
                    variantId = response.variantId,
                    resolvedMessage = response.resolvedMessage
                )

                callback(Result.success(pigeonResponse))
            } catch (e: Exception) {
                val error = FlutterError(
                    code = "NOTIFICATION_ERROR",
                    message = e.message ?: "Failed to generate notification",
                    details = e.stackTraceToString()
                )
                callback(Result.failure(error))
            }
        }
    }

    override fun recordMetric(
        request: com.inotter.pushbunnyflutter.fluttersdk.MetricRequest,
        callback: (Result<com.inotter.pushbunnyflutter.fluttersdk.MetricResponse>) -> Unit
    ) {
        scope.launch {
            try {
                val response = recordMetric(
                    variantId = request.variantId,
                    eventType = request.eventType,
                    timestamp = request.timestamp
                )

                val pigeonResponse = com.inotter.pushbunnyflutter.fluttersdk.MetricResponse(
                    status = response.status
                )

                callback(Result.success(pigeonResponse))
            } catch (e: Exception) {
                val error = FlutterError(
                    code = "METRIC_ERROR",
                    message = e.message ?: "Failed to record metric",
                    details = e.stackTraceToString()
                )
                callback(Result.failure(error))
            }
        }
    }
}
