# PushBunny Backend

FastAPI backend service for PushBunny - AI-powered push notification optimization platform.

## Overview

PushBunny lets you hand off push notification copywriting and A/B testing to an AI. Instead of writing a final message string, you send a "notification intent" with context, and PushBunny returns the best-performing message for that user.

## Features

- **REST API** with three main endpoints:
  - `POST /v1/message` - Generate/select optimized notification text
  - `POST /v1/events` - Track notification opens and conversions
  - `GET /v1/stats` - Retrieve performance analytics
- **LLM Integration** using Google Gemini for variant generation
- **A/B Testing** with round-robin variant selection
- **MySQL Database** for experiment tracking and analytics
- **Docker Support** for easy deployment

## Tech Stack

- **Framework:** FastAPI
- **Database:** MySQL with SQLAlchemy ORM
- **LLM:** Google Gemini API
- **Migrations:** Alembic
- **Testing:** Pytest
- **Containerization:** Docker & Docker Compose

## Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Security and exceptions
│   ├── db/              # Database configuration
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   └── utils/           # Utilities
├── alembic/             # Database migrations
├── tests/               # Test suite
├── Dockerfile           # Container definition
├── docker-compose.yml   # Local dev setup
└── requirements.txt     # Python dependencies
```

## Quick Start

### Prerequisites

- Python 3.11+
- MySQL 8.0+ (or use Docker Compose)
- Google Gemini API key

### Local Development

1. **Clone the repository:**
   ```bash
   cd PushBunny/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements-dev.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Run with Docker Compose (recommended):**
   ```bash
   docker-compose up
   ```
   This starts both MySQL and the FastAPI backend.

6. **Or run locally (requires MySQL running):**
   ```bash
   # Run migrations
   alembic upgrade head
   
   # Start the server
   uvicorn app.main:app --reload --port 8000
   ```

7. **Access the API:**
   - API Docs: http://localhost:8000/v1/docs
   - Health Check: http://localhost:8000/health

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=mysql+pymysql://pushbunny_user:secure_password@localhost:3306/pushbunny

# API Keys (comma-separated)
API_KEYS=pb_test_key_12345,pb_prod_key_67890

# Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Application
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## API Usage

### Authentication

All API endpoints require authentication via Bearer token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer pb_test_key_12345" \
     http://localhost:8000/v1/message
```

### Generate Message

```bash
curl -X POST http://localhost:8000/v1/message \
  -H "Authorization: Bearer pb_test_key_12345" \
  -H "Content-Type: application/json" \
  -d '{
    "intent_id": "cart_abandonment",
    "base_example": "You left items in your cart",
    "locale": "en-US",
    "user_id": "user_123",
    "context": {
      "when": "2 hours after abandonment"
    }
  }'
```

**Response:**
```json
{
  "text": "Complete your purchase - items waiting in cart!",
  "variant_id": "var_abc123",
  "experiment_id": "1",
  "tracking_token": "trk_xyz789"
}
```

### Track Events

```bash
curl -X POST http://localhost:8000/v1/events \
  -H "Authorization: Bearer pb_test_key_12345" \
  -H "Content-Type: application/json" \
  -d '[{
    "type": "opened",
    "tracking_token": "trk_xyz789",
    "timestamp": 1699999999000,
    "properties": {}
  }]'
```

### Get Statistics

```bash
curl -X GET "http://localhost:8000/v1/stats?intent_id=cart_abandonment" \
  -H "Authorization: Bearer pb_test_key_12345"
```

**Response:**
```json
{
  "intent_id": "cart_abandonment",
  "total_impressions": 1000,
  "total_opens": 150,
  "overall_open_rate": 0.15,
  "total_conversions": 25,
  "overall_conversion_rate": 0.025,
  "variants": [
    {
      "variant_id": "var_abc123",
      "text": "Complete your purchase - items waiting in cart!",
      "impressions": 334,
      "opens": 50,
      "open_rate": 0.15,
      "conversions": 8,
      "conversion_rate": 0.024
    }
  ]
}
```

## Database Migrations

### Create a new migration:
```bash
alembic revision --autogenerate -m "Add new table"
```

### Apply migrations:
```bash
alembic upgrade head
```

### Rollback migration:
```bash
alembic downgrade -1
```

## Testing

Run tests with pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_message.py
```

## Docker Deployment

### Build and run:
```bash
docker-compose up --build
```

### Run in production:
```bash
docker-compose -f docker-compose.yml up -d
```

### View logs:
```bash
docker-compose logs -f backend
```

## API Documentation

Once the server is running, visit:
- **Swagger UI:** http://localhost:8000/v1/docs
- **ReDoc:** http://localhost:8000/v1/redoc
- **OpenAPI JSON:** http://localhost:8000/v1/openapi.json

## Development

### Code Formatting

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint
flake8 app/
```

### Type Checking

```bash
mypy app/
```

## Architecture

### Database Schema

- **experiments:** Notification intents with variants
- **variants:** Different message texts for an experiment
- **impressions:** Records of messages sent to users
- **events:** User actions (opens, conversions)
- **api_keys:** API authentication (future use)

### Service Layer

- **ExperimentService:** Manages experiments and variant selection
- **LLMService:** Generates message variants using Gemini
- **EventService:** Tracks user events
- **StatsService:** Aggregates performance metrics

## Troubleshooting

### Database Connection Issues

1. Check MySQL is running: `docker-compose ps`
2. Verify DATABASE_URL in `.env`
3. Check MySQL logs: `docker-compose logs mysql`

### LLM Generation Failures

1. Verify GEMINI_API_KEY is valid
2. Check API quota/limits
3. Review logs for error messages

### Migration Errors

```bash
# Reset database (⚠️ destroys data)
alembic downgrade base
alembic upgrade head
```

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Format code: `black app/ && isort app/`
4. Run tests: `pytest`
5. Submit pull request

## License

[Add your license here]

## Support

For issues and questions:
- GitHub Issues: [link]
- Documentation: [link]
- Email: [email]
