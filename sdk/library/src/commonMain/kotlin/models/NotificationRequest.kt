package models

import kotlinx.serialization.Serializable

@Serializable
internal data class NotificationRequest(
    val text: String,
    val context: String,
    val shouldTranslate: Boolean
)

