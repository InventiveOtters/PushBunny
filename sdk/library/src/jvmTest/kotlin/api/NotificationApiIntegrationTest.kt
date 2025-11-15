package api

import kotlinx.coroutines.runBlocking
import models.NotificationResponse
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

/**
 * Integration tests for NotificationApi that call the real backend API.
 * 
 * Prerequisites:
 * - Backend server must be running at http://localhost:8080
 * - Run: cd backend && docker-compose up
 * 
 * Run these tests with: ./gradlew :library:jvmTest
 */
class NotificationApiIntegrationTest {

    companion object {
        private const val TEST_API_KEY = "test-api-key-123"
        private const val TIMEOUT_MS = 5000L
    }

    @Test
    fun `test generateNotificationBody with valid request returns response`() = runBlocking {
        // Given
        val baseMessage = "Your package has arrived!"
        val context = "delivery"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response, "Response should not be null")
        assertNotNull(response.resolvedMessage, "Resolved message should not be null")
        assertNotNull(response.variantId, "Variant ID should not be null")
        assertTrue(response.resolvedMessage.isNotEmpty(), "Resolved message should not be empty")
        assertTrue(response.variantId.isNotEmpty(), "Variant ID should not be empty")
    }

    @Test
    fun `test generateNotificationBody with e-commerce context`() = runBlocking {
        // Given
        val baseMessage = "You left items in your cart!"
        val context = "e-commerce"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with messaging context`() = runBlocking {
        // Given
        val baseMessage = "New message from John"
        val context = "messaging"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with social context`() = runBlocking {
        // Given
        val baseMessage = "Someone liked your post"
        val context = "social"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with custom intentId`() = runBlocking {
        // Given
        val baseMessage = "Breaking news update"
        val context = "news"
        val customIntentId = "custom-intent-123"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY,
            intentId = customIntentId
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with different locale`() = runBlocking {
        // Given
        val baseMessage = "Your order is ready"
        val context = "delivery"
        val locale = "es-ES"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY,
            locale = locale
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with long message`() = runBlocking {
        // Given
        val baseMessage = "This is a very long notification message that contains a lot of text " +
                "to test how the API handles longer messages and whether it can process them correctly"
        val context = "reminder"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with special characters`() = runBlocking {
        // Given
        val baseMessage = "Hello! 🎉 You've got a new message 💬 from @user123"
        val context = "messaging"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }

    @Test
    fun `test generateNotificationBody with empty context`() = runBlocking {
        // Given
        val baseMessage = "Test notification"
        val context = ""

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
    }

    @Test
    fun `test multiple sequential requests`() = runBlocking {
        // Given
        val contexts = listOf("e-commerce", "delivery", "messaging", "social", "news")
        val responses = mutableListOf<NotificationResponse>()

        // When
        contexts.forEach { context ->
            val response = generateNotificationBody(
                baseMessage = "Test message for $context",
                context = context,
                apiKey = TEST_API_KEY
            )
            responses.add(response)
        }

        // Then
        assertEquals(5, responses.size, "Should have 5 responses")
        responses.forEach { response ->
            assertNotNull(response.resolvedMessage)
            assertNotNull(response.variantId)
            assertTrue(response.resolvedMessage.isNotEmpty())
            assertTrue(response.variantId.isNotEmpty())
        }
    }

    @Test
    fun `test generateNotificationBody response structure`() = runBlocking {
        // Given
        val baseMessage = "Your order has shipped"
        val context = "delivery"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = TEST_API_KEY
        )

        // Then
        // Verify response has correct structure
        assertNotNull(response)
        assertNotNull(response.resolvedMessage)
        assertNotNull(response.variantId)

        // Verify types
        assertTrue(response.resolvedMessage is String)
        assertTrue(response.variantId is String)

        // Verify non-empty values
        assertTrue(response.resolvedMessage.isNotBlank())
        assertTrue(response.variantId.isNotBlank())
    }

    @Test
    fun `test generateNotificationBody with all parameters`() = runBlocking {
        // Given
        val baseMessage = "Complete test message"
        val context = "reminder"
        val apiKey = "full-test-api-key"
        val intentId = "test-intent-456"
        val locale = "fr-FR"

        // When
        val response = generateNotificationBody(
            baseMessage = baseMessage,
            context = context,
            apiKey = apiKey,
            intentId = intentId,
            locale = locale
        )

        // Then
        assertNotNull(response)
        assertTrue(response.resolvedMessage.isNotEmpty())
        assertTrue(response.variantId.isNotEmpty())
    }
}

