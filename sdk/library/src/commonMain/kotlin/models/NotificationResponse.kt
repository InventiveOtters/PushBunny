package models

import kotlinx.serialization.Serializable

@Serializable
data class NotificationResponse(
    val notificationBody: String,
    val variantId: String
)

