# 🐰 PushBunny Backend

AI-optimized push notification backend powered by **FastAPI**, **n8n**, and **Gemini**.

PushBunny receives notification intents from the SDK, forwards them to n8n for AI processing, stores generated variants and metrics, and returns the best current message for each user.

## 🚀 Features

- ✨ Lightweight FastAPI server
- 🤖 `/v1/resolve` → Returns optimized message for a given intent
- 📊 `/v1/metrics` → Logs opens/clicks to feed the experiment loop
- 🔄 Integrates with **n8n** workflow orchestrator calling **Gemini**
- 💾 Stores variants and metrics in **Cloud SQL (Postgres)**
- 🔐 Optional login & API keys
- ☁️ Ready for **GCP Cloud Run** deployment

---

## 📁 Project Structure

```
backend/
│
├── app/
│   ├── main.py              # FastAPI entrypoint
│   ├── config.py            # Environment vars, DB config
│   ├── database.py          # SQLAlchemy session + engine
│   ├── models.py            # ORM models: Variant, Metric, ApiKey
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── routers/
│   │   ├── resolve.py       # /v1/resolve endpoint
│   │   ├── metrics.py       # /v1/metrics endpoint
│   │   ├── variants.py      # /v1/variants endpoint
│   │   └── auth.py          # /v1/auth endpoint
│   └── services/
│       ├── n8n_client.py    # n8n workflow client
│       └── variant_logic.py # Variant selection logic
│
├── requirements.txt         # Python dependencies
├── Dockerfile               # Container image definition
├── docker-compose.yml       # Local development setup
├── cloudrun.yaml            # Cloud Run service config
├── .env.example             # Environment variables template
└── README.md                # This file
```

---

## 🌐 API Endpoints

### **POST `/v1/resolve`**

Returns an optimized message for the given intent + user.

**Request:**
```json
{
  "api_key": "optional-string",
  "intent_id": "cart_abandon",
  "locale": "en-US",
  "context": "Product: Noise-Canceling Headphones, Price: $199.99",
  "base_message": "You left something in your cart!"
}
```

**Response:**
```json
{
  "variant_id": "v_89327",
  "resolved_message": "Still thinking it over? Your headphones are waiting for you 🎧"
}
```

### **POST `/v1/metrics`**

Stores reactions to messages (sent, opened, clicked).

**Request:**
```json
{
  "user_id": "user_123",
  "intent_id": "cart_abandon",
  "variant_id": "v_89327",
  "event_type": "opened",
  "timestamp": "2025-02-15T12:01:12Z"
}
```

**Response:**
```json
{
  "status": "ok"
}
```

### **POST `/v1/auth/login`**

Returns an API key for dashboard/backend access.

**Request:**
```json
{
  "email": "test@example.com",
  "password": "mypassword"
}
```

**Response:**
```json
{
  "api_key": "pbk_live_123456"
}
```

### **GET `/v1/variants/{intent_id}`**

Returns all generated variants + metrics summary for dashboard.

**Response:**
```json
[
  {
    "variant_id": "v_1",
    "message": "Still thinking about your item?",
    "sent": 120,
    "opened": 23,
    "clicked": 4
  },
  {
    "variant_id": "v_2",
    "message": "Your headphones are waiting 🎧",
    "sent": 98,
    "opened": 31,
    "clicked": 9
  }
]
```

---

## 🗃️ Database Schema

### **Table: variants**

| Column     | Type      | Notes                |
|------------|-----------|----------------------|
| id (PK)    | UUID      | Variant ID           |
| intent_id  | TEXT      | From the SDK         |
| message    | TEXT      | AI-generated copy    |
| locale     | TEXT      | e.g. `en-US`         |
| created_at | TIMESTAMP |                      |

### **Table: metrics**

| Column      | Type      | Notes                      |
|-------------|-----------|----------------------------|
| id (PK)     | UUID      |                            |
| user_id     | TEXT      |                            |
| intent_id   | TEXT      |                            |
| variant_id  | UUID (FK) | References `variants.id`   |
| event_type  | TEXT      | sent/opened/clicked        |
| timestamp   | TIMESTAMP |                            |

### **Table: api_keys**

| Column     | Type | Notes |
|------------|------|-------|
| id (PK)    | UUID |       |
| key        | TEXT |       |
| owner      | TEXT |       |
| created_at | TIMESTAMP |   |

---

## 🛠️ Local Development

### Prerequisites

- Python 3.11+
- Docker & Docker Compose (recommended)
- PostgreSQL (if not using Docker)

### Setup with Docker Compose (Recommended)

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start the services:**
   ```bash
   docker-compose up
   ```

4. **Access the API:**
   - API: http://localhost:8080
   - Docs: http://localhost:8080/docs
   - Database: localhost:5432

### Manual Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL:**
   ```bash
   createdb pushbunny
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t pushbunny-backend .
```

### Run Container

```bash
docker run -p 8080:8080 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/pushbunny \
  -e N8N_URL=https://your-n8n.com/webhook/resolve \
  -e API_KEY_SECRET=your-secret \
  pushbunny-backend
```

---

## ☁️ GCP Cloud Run Deployment

### 1. Set up GCP Project

```bash
export PROJECT_ID=your-project-id
export REGION=europe-west1

gcloud config set project $PROJECT_ID
```

### 2. Create Cloud SQL Instance

```bash
gcloud sql instances create pushbunny-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=$REGION

# Create database
gcloud sql databases create pushbunny --instance=pushbunny-db

# Create user
gcloud sql users create pushbunny \
  --instance=pushbunny-db \
  --password=YOUR_SECURE_PASSWORD
```

### 3. Build and Push to Artifact Registry

```bash
# Enable Artifact Registry
gcloud services enable artifactregistry.googleapis.com

# Create repository
gcloud artifacts repositories create pushbunny \
  --repository-format=docker \
  --location=$REGION

# Build and push
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/pushbunny/backend
```

### 4. Deploy to Cloud Run

```bash
gcloud run deploy pushbunny-backend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/pushbunny/backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances $PROJECT_ID:$REGION:pushbunny-db \
  --set-env-vars DATABASE_URL="postgresql://pushbunny:PASSWORD@/pushbunny?host=/cloudsql/$PROJECT_ID:$REGION:pushbunny-db" \
  --set-env-vars N8N_URL="https://your-n8n.com/webhook/resolve" \
  --set-env-vars API_KEY_SECRET="your-production-secret" \
  --max-instances 10 \
  --memory 512Mi
```

### 5. Get Service URL

```bash
gcloud run services describe pushbunny-backend \
  --region $REGION \
  --format 'value(status.url)'
```

---

## 🔄 n8n Integration

The backend communicates with n8n via webhook. The n8n workflow should:

1. Receive POST request at `/webhook/resolve`
2. Process with Gemini to generate/select variant
3. Return JSON response:

```json
{
  "variant_message": "AI generated text",
  "should_store_variant": true
}
```

### n8n Workflow Setup

1. Create webhook trigger node
2. Add Gemini/OpenAI node for text generation
3. Add function node for response formatting
4. Return structured response

---

## 🧪 Testing

### Run API Tests

```bash
# Using httpie
http POST localhost:8080/v1/resolve \
  intent_id="cart_abandon" \
  user_id="test_user" \
  locale="en-US" \
  base_message="Test message"

# Using curl
curl -X POST http://localhost:8080/v1/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "intent_id": "cart_abandon",
    "user_id": "test_user",
    "locale": "en-US",
    "base_message": "Test message",
    "context": {}
  }'
```

### Interactive API Docs

Visit http://localhost:8080/docs for Swagger UI with interactive API testing.

---

## 📝 Environment Variables

| Variable        | Description                           | Default                                    |
|-----------------|---------------------------------------|-------------------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string          | `postgresql://user:password@localhost...` |
| `N8N_URL`       | n8n webhook URL                       | `https://n8n.example.com/webhook/resolve` |
| `N8N_TIMEOUT`   | n8n request timeout (seconds)         | `10`                                      |
| `API_KEY_SECRET`| Secret for API key generation         | `change-me-in-production`                 |
| `APP_NAME`      | Application name                      | `PushBunny Backend`                       |
| `DEBUG`         | Enable debug mode                     | `false`                                   |
| `CORS_ORIGINS`  | Allowed CORS origins (comma-separated)| `*`                                       |

---

## 🎯 Architecture Overview

```
SDK → Backend → n8n → Gemini
              ↓
          Database (Postgres)
              ↓
          Dashboard
```

1. **SDK** sends notification intent to backend
2. **Backend** forwards to **n8n** workflow
3. **n8n** uses **Gemini** to generate optimized message
4. **Backend** stores variant and metrics
5. **Dashboard** queries variants and performance data

---

## 🚦 Production Checklist

Before deploying to production:

- [ ] Change `API_KEY_SECRET` to secure random string
- [ ] Set up proper user authentication (replace simple login)
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Configure CORS origins to specific domains
- [ ] Set up Cloud SQL connection pooling
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure secrets management (GCP Secret Manager)
- [ ] Set up CI/CD pipeline

---

## 📄 License

This is a hackathon PoC. Licensing TBD.

---

## 🤝 Contributing

This is an MVP built for a hackathon. Contributions welcome for:

- Advanced variant selection algorithms
- Better metrics aggregation
- User authentication improvements
- Performance optimizations
- Test coverage

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the team.

---

**Built with ❤️ for the hackathon by the PushBunny team** 🐰
