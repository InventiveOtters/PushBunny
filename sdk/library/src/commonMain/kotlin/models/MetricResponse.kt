package models

import kotlinx.serialization.Serializable

/**
 * Response model for metric recording.
 * Returned by the backend after successfully recording a metric.
 */
@Serializable
data class MetricResponse(
    val status: String
)

