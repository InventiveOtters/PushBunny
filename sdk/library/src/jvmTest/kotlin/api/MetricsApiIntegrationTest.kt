package api

import kotlinx.coroutines.runBlocking
import models.MetricEventType
import models.MetricResponse
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

/**
 * Integration tests for MetricsApi that call the real backend API.
 * 
 * Prerequisites:
 * - Backend server must be running at http://localhost:8080
 * - Run: cd backend && docker-compose up
 * 
 * Run these tests with: ./gradlew :library:jvmTest
 */
class MetricsApiIntegrationTest {

    companion object {
        private const val TEST_VARIANT_ID = "a2f3c523-9240-4013-8e86-acf2600c6129"
        private const val TIMEOUT_MS = 5000L
    }

    @Test
    fun `test recordMetric with SENT event type returns ok status`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val eventType = MetricEventType.SENT.value

        // When
        val response = recordMetric(
            variantId = variantId,
            eventType = eventType
        )

        // Then
        assertNotNull(response, "Response should not be null")
        assertEquals("ok", response.status, "Status should be 'ok'")
    }

    @Test
    fun `test recordMetric with CLICKED event type returns ok status`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val eventType = MetricEventType.CLICKED.value

        // When
        val response = recordMetric(
            variantId = variantId,
            eventType = eventType
        )

        // Then
        assertNotNull(response)
        assertEquals("ok", response.status)
    }

    @Test
    fun `test recordMetric with custom timestamp`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val eventType = MetricEventType.SENT.value
        val customTimestamp = "2025-02-15T12:01:12Z"

        // When
        val response = recordMetric(
            variantId = variantId,
            eventType = eventType,
            timestamp = customTimestamp
        )

        // Then
        assertNotNull(response)
        assertEquals("ok", response.status)
    }

    @Test
    fun `test recordMetric with default timestamp`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val eventType = MetricEventType.CLICKED.value

        // When
        val response = recordMetric(
            variantId = variantId,
            eventType = eventType
            // timestamp not provided, should use default
        )

        // Then
        assertNotNull(response)
        assertEquals("ok", response.status)
    }

    @Test
    fun `test recordMetric with invalid event type throws exception`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val invalidEventType = "invalid_event"

        // When/Then
        val exception = assertFailsWith<IllegalArgumentException> {
            recordMetric(
                variantId = variantId,
                eventType = invalidEventType
            )
        }
        
        assertTrue(
            exception.message?.contains("Invalid event_type") == true,
            "Exception message should mention invalid event_type"
        )
    }

    @Test
    fun `test recordMetric with invalid variant_id format still returns ok`() = runBlocking {
        // Given - Backend returns OK even for invalid variant_id format
        val invalidVariantId = "not-a-valid-uuid"
        val eventType = MetricEventType.SENT.value

        // When
        val response = recordMetric(
            variantId = invalidVariantId,
            eventType = eventType
        )

        // Then - Backend gracefully handles invalid variant_id
        assertNotNull(response)
        assertEquals("ok", response.status)
    }

    @Test
    fun `test multiple sequential metric recordings`() = runBlocking {
        // Given
        val variantIds = listOf(
            "a2f3c523-9240-4013-8e86-acf2600c6129",
            "b3f4d634-0351-5124-9f97-bdf3711d7230",
            "c4g5e745-1462-6235-0g08-ceg4822e8341"
        )
        val responses = mutableListOf<MetricResponse>()

        // When - Record sent and clicked for each variant
        variantIds.forEach { variantId ->
            val sentResponse = recordMetric(
                variantId = variantId,
                eventType = MetricEventType.SENT.value
            )
            responses.add(sentResponse)

            val clickedResponse = recordMetric(
                variantId = variantId,
                eventType = MetricEventType.CLICKED.value
            )
            responses.add(clickedResponse)
        }

        // Then
        assertEquals(6, responses.size, "Should have 6 responses (2 per variant)")
        responses.forEach { response ->
            assertNotNull(response)
            assertEquals("ok", response.status)
        }
    }

    @Test
    fun `test recordMetric response structure`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val eventType = MetricEventType.SENT.value

        // When
        val response = recordMetric(
            variantId = variantId,
            eventType = eventType
        )

        // Then
        // Verify response has correct structure
        assertNotNull(response)
        assertNotNull(response.status)

        // Verify type
        assertTrue(response.status is String)

        // Verify value
        assertEquals("ok", response.status)
    }

    @Test
    fun `test recordMetric with both event types for same variant`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID

        // When - Record sent first
        val sentResponse = recordMetric(
            variantId = variantId,
            eventType = MetricEventType.SENT.value
        )

        // Then
        assertEquals("ok", sentResponse.status)

        // When - Record clicked after
        val clickedResponse = recordMetric(
            variantId = variantId,
            eventType = MetricEventType.CLICKED.value
        )

        // Then
        assertEquals("ok", clickedResponse.status)
    }

    @Test
    fun `test recordMetric validates event type before making request`() = runBlocking {
        // Given
        val variantId = TEST_VARIANT_ID
        val invalidEventTypes = listOf("opened", "dismissed", "received", "")

        // When/Then - Each invalid type should throw exception
        invalidEventTypes.forEach { invalidType ->
            assertFailsWith<IllegalArgumentException> {
                recordMetric(
                    variantId = variantId,
                    eventType = invalidType
                )
            }
        }
    }
}

