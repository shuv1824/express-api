# TypeScript Express API

A comprehensive, production-ready Node.js API built with TypeScript, Express, and MongoDB. This project demonstrates modern backend development practices with authentication, data validation, testing, and security best practices.

## Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Request validation using Joi
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Testing**: Comprehensive test suite with Jest and Supertest
- **Error Handling**: Global error handling with proper HTTP status codes
- **Logging**: Structured logging system
- **API Documentation**: Well-documented REST API endpoints
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## Project Structure

```
src/
├── __tests__/          # Test files
│   ├── controllers/    # Controller tests
│   ├── models/         # Model tests
│   └── setup.ts        # Test configuration
├── config/             # Configuration files
│   ├── database.ts     # Database configuration
│   └── index.ts        # Main config
├── controllers/        # Request handlers
│   ├── auth.ts         # Authentication controller
│   └── user.ts         # User management controller
├── middleware/         # Express middleware
│   ├── auth.ts         # Authentication middleware
│   ├── error.ts        # Error handling middleware
│   ├── security.ts     # Security middleware
│   └── validation.ts   # Validation middleware
├── models/             # Database models
│   └── User.ts         # User model
├── routes/             # Route definitions
│   ├── auth.ts         # Auth routes
│   ├── index.ts        # Main router
│   └── user.ts         # User routes
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
├── utils/              # Utility functions
│   ├── logger.ts       # Logging utility
│   ├── response.ts     # Response formatting
│   └── validation.ts   # Validation schemas
├── app.ts              # Express app setup
└── server.ts           # Server entry point
```

## Installation

You can set up this project using either traditional Node.js installation or Docker (recommended for consistency across environments).

### Option 1: Docker Installation (Recommended)

#### Prerequisites
- Docker Desktop (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Make (optional, for convenience commands)

#### Quick Start with Docker

1. **Clone the repository**

```bash
git clone <repository-url>
cd express-api
```

2. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

3. **Start the development environment**

```bash
# Using Make (recommended)
make dev-build

# Or using Docker Compose directly
docker-compose -f docker-compose.dev.yml up --build
```

The API will be available at `http://localhost:5000` with hot-reloading enabled.

#### Docker Commands

```bash
# Development
make dev              # Start development environment
make dev-build        # Build and start development environment
make dev-down         # Stop development environment
make dev-logs         # View development logs
make dev-shell        # Access container shell
make dev-debug        # Start with debugging on port 9229
make dev-tools        # Start with MongoDB Express GUI

# Production
make prod             # Start production environment
make prod-build       # Build and start production environment
make prod-down        # Stop production environment

# Testing
make test             # Run tests in Docker
make test-watch       # Run tests in watch mode

# Database
make db-shell         # Access MongoDB shell
make db-backup        # Backup database

# Cleanup
make clean            # Remove all containers and volumes
```

#### Development with MongoDB Express

To use the MongoDB GUI interface:

```bash
# Start development with MongoDB Express
make dev-tools

# Access MongoDB Express at http://localhost:8081
# Default credentials: admin/pass
```

### Option 2: Traditional Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd express-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
   Make sure MongoDB is running on your system, or update the `MONGODB_URI` in your `.env` file.

### Docker Architecture

The project includes multiple Docker configurations:

| File | Purpose | Features |
|------|---------|----------|
| `Dockerfile` | Production build | Multi-stage build, minimal size, non-root user |
| `Dockerfile.dev` | Development environment | Hot-reloading, debugging, all dev tools |
| `docker-compose.yml` | Production orchestration | API + MongoDB, health checks, restart policies |
| `docker-compose.dev.yml` | Development orchestration | Volume mounts, debugging ports, MongoDB Express |
| `Makefile` | Convenience commands | Simplified Docker operations |

## Getting Started

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/typescript-express-api

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

### User Management Endpoints (Admin Only)

#### Get All Users

```http
GET /api/users?page=1&limit=10&search=john
Authorization: Bearer <admin_jwt_token>
```

#### Get User by ID

```http
GET /api/users/:id
Authorization: Bearer <admin_jwt_token>
```

#### Create User

```http
POST /api/users
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

#### Update User

```http
PUT /api/users/:id
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "role": "admin",
  "isActive": false
}
```

#### Delete User

```http
DELETE /api/users/:id
Authorization: Bearer <admin_jwt_token>
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Joi schema validation for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Stateless authentication
- **SQL Injection Protection**: MongoDB query sanitization
- **XSS Protection**: Input sanitization

## Testing

The project includes comprehensive tests covering:

- **Unit Tests**: Model validation and business logic
- **Integration Tests**: API endpoints and middleware
- **Authentication Tests**: Login, registration, and token validation
- **Authorization Tests**: Role-based access control

Test files are organized in the `src/__tests__/` directory with the same structure as the main source code.

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Best Practices Implemented

1. **TypeScript**: Strict type checking and interfaces
2. **Error Handling**: Global error middleware with proper HTTP status codes
3. **Validation**: Input validation at multiple layers
4. **Security**: Multiple security middleware layers
5. **Testing**: High test coverage with different test types
6. **Code Organization**: Clean architecture with separation of concerns
7. **Documentation**: Comprehensive README and code comments
8. **Environment Configuration**: Flexible environment-based configuration
9. **Logging**: Structured logging with different log levels
10. **Database**: Proper indexing and query optimization

## Deployment

### Docker Deployment

The project includes production-ready Docker configurations:

#### Build and Run Production Container

```bash
# Build production image
docker build -t express-api:latest .

# Run with docker-compose (includes MongoDB)
docker-compose up -d

# Or run standalone (requires external MongoDB)
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name express-api \
  express-api:latest
```

#### Production Docker Features

- Multi-stage build for minimal image size (~150MB)
- Non-root user for security
- Health checks for reliability
- Proper signal handling with dumb-init
- Environment variable configuration
- Persistent MongoDB volumes

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Set up proper MongoDB connection
- [ ] Configure CORS for your domain
- [ ] Set up reverse proxy (nginx)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting for your use case
