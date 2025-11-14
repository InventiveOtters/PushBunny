#!/bin/bash

# PushBunny Backend Setup Script

echo "🐰 Setting up PushBunny Backend..."

# Create .env from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your actual credentials (especially GEMINI_API_KEY)"
else
    echo "✅ .env file already exists"
fi

# Create virtual environment if it doesn't exist
if [ ! -d venv ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your credentials (especially GEMINI_API_KEY)"
echo "  2. Start services with: docker-compose up"
echo "  3. Or run locally:"
echo "     - source venv/bin/activate"
echo "     - alembic upgrade head"
echo "     - uvicorn app.main:app --reload"
echo ""
echo "📚 API Documentation will be available at: http://localhost:8000/v1/docs"
