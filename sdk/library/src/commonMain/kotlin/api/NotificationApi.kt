package api

import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.datetime.Clock
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import models.NotificationRequest
import models.NotificationResponse
import network.ApiConstants
import network.HttpClientProvider

/**
 * Generates a notification body by calling the PushBunny backend API.
 *
 * The backend performs A/B testing on multiple variants to determine
 * the best performing notification text.
 *
 * @param baseMessage The fallback message if AI fails
 * @param context Additional context data about the base_message
 * @param apiKey The API key for authentication
 * @param intentId Intent identifier from SDK (defaults to random UUID)
 * @param locale User locale (defaults to "en-US")
 * @return The NotificationResponse containing the notification body and variant ID
 * @throws Exception if the request fails (network error, server error, parsing error, etc.)
 */
@OptIn(ExperimentalUuidApi::class)
suspend fun generateNotificationBody(
    baseMessage: String,
    context: String,
    apiKey: String,
    intentId: String? = null,
    locale: String = "en-US"
): NotificationResponse {
    return HttpClientProvider.client.post(
        "${ApiConstants.BASE_URL}${ApiConstants.GENERATE_ENDPOINT}"
    ) {
        contentType(ContentType.Application.Json)
        setBody(
            NotificationRequest(
                intentId = intentId ?: Uuid.random().toString(),
                locale = locale,
                context = context,
                baseMessage = baseMessage,
                timestamp = Clock.System.now().toString(),
                apiKey = apiKey
            )
        )
    }.body<NotificationResponse>()
}
