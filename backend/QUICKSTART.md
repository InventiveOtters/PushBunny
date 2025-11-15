# 🚀 Quick Start Guide

Get PushBunny backend running in 5 minutes!

## Option 1: Docker Compose (Easiest)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Start everything
docker-compose up

# 3. Test the API
curl http://localhost:8080/health
```

That's it! The API is running at http://localhost:8080

**View API docs:** http://localhost:8080/docs

---

## Option 2: Local Development

### Prerequisites
- Python 3.11+
- PostgreSQL 15+

### Steps

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment
cp .env.example .env
# Edit .env with your database URL

# 4. Initialize database
python scripts/init_db.py

# 5. (Optional) Seed sample data
python scripts/seed_data.py

# 6. Run the server
uvicorn app.main:app --reload
```

---

## Testing the API

### Health Check
```bash
curl http://localhost:8080/health
```

### Resolve Intent (with fallback)
```bash
curl -X POST http://localhost:8080/v1/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "intent_id": "cart_abandon",
    "context": "Product: Headphones, Price: $199.99",
    "base_message": "You left something in your cart!"
  }'
```

### Record Metric
```bash
curl -X POST http://localhost:8080/v1/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "intent_id": "cart_abandon",
    "variant_id": "PUT_VARIANT_ID_HERE",
    "event_type": "opened"
  }'
```

### Get Variants for Intent
```bash
curl http://localhost:8080/v1/variants/cart_abandon
```

---

## Next Steps

1. **Configure n8n:** Set up your n8n workflow and update `N8N_URL` in `.env`
2. **Test with SDK:** Integrate with the Android SDK
3. **Deploy:** Follow deployment guide in README.md

---

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL in `.env`

### n8n Integration Not Working
- n8n will fail until you set up the workflow
- Backend falls back to `base_message` if n8n fails
- Check n8n URL is accessible

### Port Already in Use
```bash
# Change port in docker-compose.yml or when running uvicorn
uvicorn app.main:app --reload --port 8081
```

---

## Using Make Commands

```bash
make install    # Install dependencies
make dev        # Run dev server
make init-db    # Initialize database
make seed-db    # Seed sample data
make docker-run # Run with Docker
```

---

Happy coding! 🐰
