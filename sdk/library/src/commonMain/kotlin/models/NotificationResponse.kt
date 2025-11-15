package models

import kotlinx.serialization.Serializable

@Serializable
internal data class NotificationResponse(
    val notificationBody: String
)

