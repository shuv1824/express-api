.PHONY: help dev dev-build dev-down dev-logs dev-shell prod prod-build prod-down prod-logs clean test

# Default target
help:
	@echo "Available commands:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Build and start development environment"
	@echo "  make dev-down     - Stop development environment"
	@echo "  make dev-logs     - Show development logs"
	@echo "  make dev-shell    - Open shell in development container"
	@echo "  make dev-debug    - Start development with debugging enabled"
	@echo "  make dev-tools    - Start development with MongoDB Express"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Build and start production environment"
	@echo "  make prod-down    - Stop production environment"
	@echo "  make prod-logs    - Show production logs"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make test         - Run tests in Docker"
	@echo "  make test-watch   - Run tests in watch mode"

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-build:
	docker-compose -f docker-compose.dev.yml up -d --build

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f api-dev

dev-shell:
	docker-compose -f docker-compose.dev.yml exec api-dev sh

dev-debug:
	docker-compose -f docker-compose.dev.yml run --rm -p 5000:5000 -p 9229:9229 api-dev node --inspect=0.0.0.0:9229 -r tsx/cjs src/server.ts

dev-tools:
	docker-compose -f docker-compose.dev.yml --profile tools up

# Production commands
prod:
	docker-compose up -d

prod-build:
	docker-compose up -d --build

prod-down:
	docker-compose down

prod-logs:
	docker-compose logs -f api

# Testing commands
test:
	docker-compose -f docker-compose.dev.yml run --rm api-dev npm test

test-watch:
	docker-compose -f docker-compose.dev.yml run --rm api-dev npm run test:watch

# Cleanup commands
clean:
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	docker system prune -f

# Database commands
db-shell:
	docker-compose -f docker-compose.dev.yml exec mongodb-dev mongosh express-api-dev

db-backup:
	docker-compose -f docker-compose.dev.yml exec mongodb-dev mongodump --db express-api-dev --out /data/backup
	docker cp express-api-mongodb-dev:/data/backup ./backup-$(shell date +%Y%m%d-%H%M%S)

# Build commands
build-dev:
	docker build -f Dockerfile.dev -t express-api:dev .

build-prod:
	docker build -f Dockerfile -t express-api:latest .
