# 🚀 Dashboard Quick Start

Get the PushBunny dashboard running in 2 minutes!

## Prerequisites

- Node.js 18+ installed
- Backend running on http://localhost:8080

## Steps

```bash
# 1. Navigate to dashboard folder
cd dashboard

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:8080" > .env

# 4. Start dev server
npm run dev
```

## 🎉 Done!

Open http://localhost:3000 in your browser.

## Quick Test

1. Click **"Dashboard"** button in navigation
2. Login with any email/password (demo mode)
3. View your notification analytics

## Need Sample Data?

In your backend, run:

```bash
cd ../backend
python scripts/seed_data.py
```

This will populate the database with sample variants and metrics.

## 🎨 What You'll See

- Beautiful landing page with animated gradients
- Secure login flow
- Analytics dashboard with:
  - Intent selector tabs
  - Statistics cards (sent, opened, clicked, CTR)
  - Interactive charts
  - Detailed variants table

## 🔧 Common Issues

**Backend not connecting?**
```bash
# Make sure backend is running
cd ../backend
docker-compose up
```

**Port 3000 already in use?**
```bash
# Edit vite.config.js and change port
server: {
  port: 3001
}
```

---

Happy analyzing! 🐰✨
