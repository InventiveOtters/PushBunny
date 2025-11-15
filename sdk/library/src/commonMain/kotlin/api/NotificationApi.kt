package api

import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
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
 * @param text The base notification text
 * @param context The context for the notification (e.g., "e-commerce", "delivery")
 * @param shouldTranslate Whether the notification should be translated
 * @return The NotificationResponse containing the notification body and variant ID
 * @throws Exception if the request fails (network error, server error, parsing error, etc.)
 */
suspend fun generateNotificationBody(
    text: String,
    context: String,
    shouldTranslate: Boolean
): NotificationResponse {
    return HttpClientProvider.client.post(
        "${ApiConstants.BASE_URL}${ApiConstants.GENERATE_ENDPOINT}"
    ) {
        contentType(ContentType.Application.Json)
        setBody(
            NotificationRequest(
                text = text,
                context = context,
                shouldTranslate = shouldTranslate
            )
        )
    }.body<NotificationResponse>()
}

