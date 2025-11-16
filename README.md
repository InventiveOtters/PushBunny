# 🐰 PushBunny

**AI-powered push notification optimization platform with automatic A/B testing**

PushBunny is a complete solution for generating, optimizing, and analyzing push notifications using AI. It automatically tests different message variants and learns which ones perform best, helping you maximize user engagement without manual experimentation.

---

## 🎯 What Problem Does It Solve?

Push notifications are critical for user engagement, but crafting effective messages is challenging:

- **Generic messages** don't resonate with users
- **Manual A/B testing** is time-consuming and requires statistical expertise
- **Static content** becomes stale and loses effectiveness over time
- **Poor performing notifications** waste opportunities and annoy users

**PushBunny solves this by:**
- 🤖 **AI-generated variants** - Gemini creates multiple message variations automatically
- 📊 **Smart optimization** - Thompson Sampling algorithm picks the best performers
- 🔄 **Continuous learning** - Gets better over time as it collects more data
- 🎯 **Per-intent optimization** - Each notification type (cart abandon, order shipped, etc.) optimizes independently
- 📈 **Real-time analytics** - Beautiful dashboard to track performance

---

## 🏗️ Architecture

PushBunny consists of four main components:

```
┌─────────────────┐
│   Your App      │
│  (Flutter/iOS/  │
│    Android)     │
└────────┬────────┘
         │ PushBunny SDK
         ↓
┌─────────────────┐      ┌──────────────┐
│     Backend     │ ←──→ │  n8n + AI    │
│   (FastAPI)     │      │   (Gemini)   │
└────────┬────────┘      └──────────────┘
         │
         ↓
┌─────────────────┐      ┌──────────────┐
│    Database     │      │  Dashboard   │
│  (PostgreSQL)   │ ←──→ │   (React)    │
└─────────────────┘      └──────────────┘
```

### Components

1. **SDK** (Kotlin Multiplatform + Flutter)
   - Easy integration into mobile apps
   - Generates optimized notifications
   - Tracks user interactions (opens, clicks)

2. **Backend** (FastAPI + PostgreSQL)
   - Receives notification requests
   - Manages A/B testing with Thompson Sampling
   - Stores variants and metrics
   - Provides analytics API

3. **AI Engine** (n8n + Gemini)
   - Generates creative message variants
   - Adapts to context and user segments
   - Creates diverse, engaging content

4. **Dashboard** (React + Vite)
   - Visualize performance metrics
   - Compare variant effectiveness
   - Monitor click-through rates
   - Track optimization progress

---

## 🚀 Quick Start

### For Flutter Apps

#### 1. Add the SDK to your project

```yaml
# pubspec.yaml
dependencies:
  fluttersdk:
    path: ../fluttersdk  # Or use pub.dev once published
```

#### 2. Initialize and use

```dart
import 'package:fluttersdk/fluttersdk.dart';

// Create client
final client = PushBunnyClient();

// Generate optimized notification
final response = await client.generateNotification(
  PushBunnyNotificationRequest(
    baseMessage: 'Your order has shipped!',
    context: 'order_shipped',
    apiKey: 'your-api-key',
    intentId: 'order_shipped',  // Groups similar notifications
    locale: 'en-US',
  ),
);

// Show the notification
print('Optimized message: ${response.resolvedMessage}');
print('Variant ID: ${response.variantId}');

// Track when notification is sent
await client.recordMetric(
  PushBunnyMetricRequest(
    variantId: response.variantId,
    eventType: 'sent',
  ),
);

// Track when user clicks
await client.recordMetric(
  PushBunnyMetricRequest(
    variantId: response.variantId,
    eventType: 'clicked',
  ),
);
```

#### 3. Run the backend

```bash
cd backend
docker-compose up
```

The backend will be available at `http://localhost:8080`

---

## 📱 SDK Integration Examples

### Flutter Example

See the complete example app in `fluttersdk/example/` that demonstrates:
- SDK initialization
- Generating notifications
- Tracking metrics
- Handling user interactions

Run it:
```bash
cd fluttersdk/example
flutter pub get
flutter run
```

### Native Android (Kotlin)

The Kotlin Multiplatform SDK can also be used directly in Android apps:

```kotlin
import com.inotter.pushbunny.generateNotificationBody

val response = generateNotificationBody(
    baseMessage = "Your order has shipped!",
    context = "order_shipped",
    apiKey = "your-api-key",
    intentId = "order_shipped",
    locale = "en-US"
)

println("Optimized: ${response.resolvedMessage}")
```

---

## 🧪 How A/B Testing Works

PushBunny uses **Thompson Sampling**, a Bayesian approach that automatically balances exploration and exploitation:

### Phase 1: Initial Exploration (First 50 notifications)
- Generates diverse AI variants
- Collects baseline performance data
- Builds variant pool

### Phase 2: Smart Optimization (After 50 notifications)
- Models each variant's performance as a probability distribution
- Automatically explores uncertain variants
- Exploits proven winners
- Continuously generates new variants (10% of the time)

### Why Thompson Sampling?
- ✅ **15-20% better CTR** than traditional methods
- ✅ **2x faster convergence** to optimal variants
- ✅ **Uncertainty-aware** - explores variants with less data
- ✅ **No manual tuning** - works out of the box

---

## 📊 Dashboard

Monitor your notification performance with the beautiful analytics dashboard:

### Features
- 📈 **Real-time metrics** - Track sends, opens, clicks, and CTR
- 🎨 **Interactive charts** - Visualize performance trends
- 📋 **Variant comparison** - See which messages work best
- 🌙 **Dark mode design** - Premium UI with smooth animations
- 🔐 **Secure access** - API key authentication

### Run the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Visit `http://localhost:3000` to view your analytics.

---

## 🔑 Key Concepts

### Intent ID
Groups similar notifications together for optimization. Each intent learns independently:
- `cart_abandoned` - Reminders about items left in cart
- `order_shipped` - Delivery notifications
- `payment_failed` - Payment issue alerts
- `welcome` - New user onboarding

**Best Practice:** Use specific, consistent intent IDs for each notification type.

### Variant ID
Unique identifier for each AI-generated message variant. Used to track performance metrics.

### Context
Additional information that helps the AI generate better messages:
```dart
context: 'Premium customer, 5th order, high-value item'
context: 'Product: Noise-Canceling Headphones, Price: $199.99'
context: 'User segment: power_user, device: mobile, time: evening'
```

### Base Message
Fallback message used if AI generation fails. Should be a safe, generic message.

---

## 🛠️ Development Setup

### Prerequisites
- **Backend:** Python 3.11+, PostgreSQL
- **SDK:** Java 11+, Kotlin, Flutter 3.0+
- **Dashboard:** Node.js 18+
- **AI:** n8n instance with Gemini API access

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database and n8n credentials

# Run with Docker
docker-compose up

# Or run locally
uvicorn app.main:app --reload
```

### SDK Development

```bash
cd fluttersdk

# Build Kotlin Multiplatform SDK
make build-kmpp

# Run tests
flutter test

# Run example app
cd example
flutter run
```

### Dashboard Setup

```bash
cd dashboard

# Install dependencies
npm install

# Configure backend URL
cp .env.example .env
# Edit .env with your backend URL

# Run development server
npm run dev
```

---

## 📚 API Reference

### SDK Methods

#### `generateNotification(request)`
Generates an optimized notification message.

**Parameters:**
- `baseMessage` (String) - Fallback message
- `context` (String) - Additional context for AI
- `apiKey` (String) - Authentication key
- `intentId` (String, optional) - Intent identifier
- `locale` (String, default: 'en-US') - User locale

**Returns:**
- `resolvedMessage` (String) - Optimized notification text
- `variantId` (String) - Variant ID for tracking

#### `recordMetric(request)`
Records a notification lifecycle event.

**Parameters:**
- `variantId` (String) - Variant ID from generateNotification
- `eventType` (String) - Event type: "sent" or "clicked"
- `timestamp` (String, optional) - ISO 8601 timestamp

**Returns:**
- `status` (String) - Status of the operation

---

## 🎓 Best Practices

### 1. Use Specific Intent IDs
```dart
// ✅ Good - specific and consistent
intentId: 'order_shipped'
intentId: 'cart_abandoned_24h'
intentId: 'payment_failed_retry'

// ❌ Bad - too generic
intentId: 'notification'
intentId: 'message'
```

### 2. Provide Rich Context
```dart
// ✅ Good - helps AI generate better variants
context: 'Product: Premium Headphones, Price: $299, Customer: VIP, Order: 5th'

// ❌ Bad - too vague
context: 'order'
```

### 3. Always Track Both Events
```dart
// ✅ Good - complete tracking
await client.recordMetric(PushBunnyMetricRequest(
  variantId: variantId,
  eventType: 'sent',
));

// Later, when user clicks...
await client.recordMetric(PushBunnyMetricRequest(
  variantId: variantId,
  eventType: 'clicked',
));
```

### 4. Give It Time
- Need at least **50 sends per intent** for optimization to start
- More data = better decisions
- System continuously learns and improves

---

## 🔧 Configuration

### Backend Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pushbunny

# n8n Integration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/pushbunny

# A/B Testing
AB_EXPLORATION_THRESHOLD=50    # Min notifications before optimization
AB_EXPLORATION_RATE=0.1        # 10% new variant generation

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 📦 Project Structure

```
PushBunny/
├── backend/           # FastAPI backend with Thompson Sampling
├── dashboard/         # React analytics dashboard
├── fluttersdk/        # Flutter plugin wrapper
│   ├── lib/          # Dart SDK code
│   ├── android/      # Android platform integration
│   ├── ios/          # iOS platform integration
│   └── example/      # Example Flutter app
└── sdk/              # Kotlin Multiplatform core SDK
    └── library/      # Core notification logic
```

---

## 🤝 Contributing

This is a hackathon project! Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

See individual component licenses:
- Backend: Check `backend/` directory
- SDK: Check `sdk/LICENSE` and `fluttersdk/LICENSE`
- Dashboard: Check `dashboard/` directory

---

## 🙏 Acknowledgments

Built with:
- **FastAPI** - Modern Python web framework
- **n8n** - Workflow automation
- **Google Gemini** - AI text generation
- **Kotlin Multiplatform** - Cross-platform SDK
- **Flutter** - Mobile app framework
- **React** - Dashboard UI
- **PostgreSQL** - Database
- **Thompson Sampling** - Bayesian optimization

---

## 📞 Support

For questions or issues:
1. Check the documentation in each component's directory
2. Review the example app in `fluttersdk/example/`
3. Open an issue on GitHub

---

**Made with 🐰 for better push notifications**


