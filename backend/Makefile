.PHONY: help install dev run test docker-build docker-run clean init-db seed-db

help:
	@echo "PushBunny Backend - Available Commands:"
	@echo ""
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Run development server with auto-reload"
	@echo "  make run         - Run production server"
	@echo "  make init-db     - Initialize database tables"
	@echo "  make seed-db     - Seed database with sample data"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run  - Run with Docker Compose"
	@echo "  make clean       - Clean up Python cache files"
	@echo ""

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

run:
	uvicorn app.main:app --host 0.0.0.0 --port 8080

init-db:
	python scripts/init_db.py

seed-db:
	python scripts/seed_data.py

docker-build:
	docker build -t pushbunny-backend .

docker-run:
	docker-compose up

docker-stop:
	docker-compose down

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.log" -delete
