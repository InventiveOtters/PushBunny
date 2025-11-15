# 🏗️ PushBunny Backend Structure

Complete directory structure and file descriptions.

```
backend/
│
├── 📄 README.md              # Main documentation
├── 📄 QUICKSTART.md          # Quick start guide
├── 📄 STRUCTURE.md           # This file - structure overview
│
├── 🐳 Docker & Deployment
│   ├── Dockerfile            # Container image definition
│   ├── docker-compose.yml    # Local development setup
│   ├── cloudrun.yaml         # GCP Cloud Run configuration
│   ├── .dockerignore         # Docker build exclusions
│   └── Makefile              # Convenience commands
│
├── ⚙️ Configuration
│   ├── .env.example          # Environment variables template
│   ├── .gitignore            # Git exclusions
│   └── requirements.txt      # Python dependencies
│
├── 📦 app/                   # Main application package
│   ├── __init__.py
│   ├── main.py              # FastAPI app entrypoint
│   ├── config.py            # Settings & environment vars
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # ORM models (Variant, Metric, ApiKey)
│   ├── schemas.py           # Pydantic request/response schemas
│   │
│   ├── 🔀 routers/          # API endpoints
│   │   ├── __init__.py
│   │   ├── resolve.py       # POST /v1/resolve
│   │   ├── metrics.py       # POST /v1/metrics
│   │   ├── variants.py      # GET /v1/variants/{intent_id}
│   │   └── auth.py          # POST /v1/auth/login
│   │
│   └── 🛠️ services/         # Business logic
│       ├── __init__.py
│       ├── n8n_client.py    # n8n integration
│       └── variant_logic.py # Variant selection & storage
│
└── 📜 scripts/              # Database utilities
    ├── __init__.py
    ├── init_db.py           # Initialize database tables
    └── seed_data.py         # Seed sample data
```

---

## 📋 File Descriptions

### Core Application

- **`app/main.py`** - FastAPI application instance, CORS setup, router registration, startup/shutdown logic
- **`app/config.py`** - Environment-based configuration using Pydantic Settings
- **`app/database.py`** - SQLAlchemy engine, session factory, and database initialization
- **`app/models.py`** - Database ORM models: `Variant`, `Metric`, `ApiKey`
- **`app/schemas.py`** - Pydantic schemas for request validation and response serialization

### API Routers

- **`routers/resolve.py`** - Handles `/v1/resolve` - returns optimized message for intent
- **`routers/metrics.py`** - Handles `/v1/metrics` - stores user interaction metrics
- **`routers/variants.py`** - Handles `/v1/variants/{intent_id}` - returns variant performance data
- **`routers/auth.py`** - Handles `/v1/auth/login` - generates API keys

### Services

- **`services/n8n_client.py`** - HTTP client for n8n workflow integration
- **`services/variant_logic.py`** - Variant storage, retrieval, and best-variant selection logic

### Scripts

- **`scripts/init_db.py`** - Creates all database tables
- **`scripts/seed_data.py`** - Populates database with sample data for testing

### Configuration & Deployment

- **`requirements.txt`** - Python package dependencies
- **`Dockerfile`** - Multi-stage Docker build for production
- **`docker-compose.yml`** - Local development environment (backend + PostgreSQL)
- **`cloudrun.yaml`** - Google Cloud Run service configuration
- **`.env.example`** - Template for environment variables
- **`Makefile`** - Common development commands

---

## 🔄 Request Flow

### 1. Resolve Intent Flow

```
SDK → POST /v1/resolve → resolve.py
                           ↓
                      n8n_client.py → n8n Webhook → Gemini
                           ↓
                      variant_logic.py (store if new)
                           ↓
                        Database
                           ↓
                      Return variant
```

### 2. Metrics Flow

```
SDK → POST /v1/metrics → metrics.py
                           ↓
                        Database (metrics table)
```

### 3. Dashboard Flow

```
Dashboard → GET /v1/variants/{intent_id} → variants.py
                                              ↓
                                        variant_logic.py
                                              ↓
                                      Aggregate metrics
                                              ↓
                                        Return summary
```

---

## 🗄️ Database Schema

### Tables

1. **variants** - Stores AI-generated message variants
2. **metrics** - Stores user interaction events (sent, opened, clicked)
3. **api_keys** - Stores API keys for authentication

### Relationships

- `metrics.variant_id` → `variants.id` (Foreign Key)

---

## 🚀 Getting Started

Choose your path:

1. **Quick Demo:** `docker-compose up` → http://localhost:8080/docs
2. **Local Dev:** See `QUICKSTART.md`
3. **Production:** See `README.md` deployment section

---

## 📚 Key Technologies

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL ORM
- **Pydantic** - Data validation
- **PostgreSQL** - Database
- **httpx** - Async HTTP client
- **Uvicorn** - ASGI server
- **Docker** - Containerization
- **GCP Cloud Run** - Serverless deployment

---

## 🎯 Next Steps

1. Set up n8n workflow (see README.md)
2. Configure environment variables
3. Initialize database: `python scripts/init_db.py`
4. Run locally: `make dev`
5. Test endpoints: http://localhost:8080/docs
6. Deploy to Cloud Run (see README.md)

---

**Last Updated:** 2025-02-15
