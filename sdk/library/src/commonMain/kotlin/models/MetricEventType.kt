package models

/**
 * Enum representing the types of metric events that can be recorded.
 * 
 * These event types are used to track notification lifecycle:
 * - SENT: Notification was sent to the user
 * - CLICKED: User clicked/opened the notification
 */
enum class MetricEventType(val value: String) {
    /**
     * Notification was sent to the user.
     */
    SENT("sent"),
    
    /**
     * User clicked/opened the notification.
     */
    CLICKED("clicked")
}

