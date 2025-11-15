package models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
@Serializable
internal data class NotificationRequest(
    @SerialName("intent_id")
    val intentId: String = Uuid.random().toString(),
    val locale: String = "en-US",
    val context: String,
    @SerialName("base_message")
    val baseMessage: String,
    val timestamp: String,
    @SerialName("api_key")
    val apiKey: String
)

