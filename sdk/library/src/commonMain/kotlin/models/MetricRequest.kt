package models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * Internal request model for recording metrics to the backend.
 * Maps to the backend's MetricRequest schema.
 */
@Serializable
internal data class MetricRequest(
    @SerialName("variant_id")
    val variantId: String,
    @SerialName("event_type")
    val eventType: String,
    val timestamp: String
)

