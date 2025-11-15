package models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class NotificationResponse(
    @SerialName("variant_id")
    val variantId: String,
    @SerialName("resolved_message")
    val resolvedMessage: String
)

