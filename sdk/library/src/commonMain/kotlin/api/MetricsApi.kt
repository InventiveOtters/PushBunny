package api

import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.datetime.Clock
import models.MetricEventType
import models.MetricRequest
import models.MetricResponse
import network.ApiConstants
import network.HttpClientProvider

/**
 * Records a notification metric event to the PushBunny backend.
 *
 * This function tracks notification lifecycle events (sent, clicked) for A/B testing
 * and analytics purposes. The backend uses these metrics to determine which notification
 * variants perform best.
 *
 * @param variantId The variant ID returned from generateNotificationBody
 * @param eventType The type of event (use MetricEventType.SENT or MetricEventType.CLICKED)
 * @param timestamp Optional ISO 8601 timestamp (defaults to current time)
 * @return MetricResponse with status "ok" if successful
 * @throws IllegalArgumentException if eventType is not "sent" or "clicked"
 * @throws Exception if the request fails (network error, server error, etc.)
 *
 * @sample
 * ```kotlin
 * // Record a "sent" metric
 * val response = recordMetric(
 *     variantId = "a2f3c523-9240-4013-8e86-acf2600c6129",
 *     eventType = MetricEventType.SENT.value
 * )
 *
 * // Record a "clicked" metric with custom timestamp
 * val response = recordMetric(
 *     variantId = "a2f3c523-9240-4013-8e86-acf2600c6129",
 *     eventType = MetricEventType.CLICKED.value,
 *     timestamp = "2025-02-15T12:01:12Z"
 * )
 * ```
 */
@Throws(Exception::class)
suspend fun recordMetric(
    variantId: String,
    eventType: String,
    timestamp: String? = null
): MetricResponse {
    // Validate event type
    val validEventTypes = setOf(MetricEventType.SENT.value, MetricEventType.CLICKED.value)
    require(eventType in validEventTypes) {
        "Invalid event_type: '$eventType'. Must be one of: ${validEventTypes.joinToString(", ")}"
    }
    
    val response = HttpClientProvider.client.post(
        "${ApiConstants.BASE_URL}${ApiConstants.METRICS_ENDPOINT}"
    ) {
        contentType(ContentType.Application.Json)
        setBody(
            MetricRequest(
                variantId = variantId,
                eventType = eventType,
                timestamp = timestamp ?: Clock.System.now().toString()
            )
        )
    }
    
    return response.body<MetricResponse>()
}

