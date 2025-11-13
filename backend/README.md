# Whatfix Shopping Backend

Express.js backend API for the Whatfix Shopping application, structured using the MVC (Model-View-Controller) pattern.

## Project Structure

```
backend/
├── src/
│   ├── models/          # Data models and business logic
│   │   └── DashboardConfig.ts
│   ├── controllers/     # Request handlers
│   │   └── configController.ts
│   ├── routes/          # API route definitions
│   │   └── configRoutes.ts
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── package.json
└── tsconfig.json
```

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:3001` (or the PORT specified in environment variables).

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Get Dashboard Configuration
- **URL:** `/api/config`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "headerConfig": { ... },
      "leftNavConfig": { ... },
      "secondaryConfig": { ... }
    }
  }
  ```

### Health Check
- **URL:** `/health`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "ok",
    "message": "Server is running"
  }
  ```

## Environment Variables

- `PORT` - Server port (default: 3001)

## MVC Architecture

- **Models** (`src/models/`): Define data structures and business logic
- **Controllers** (`src/controllers/`): Handle HTTP requests and responses
- **Routes** (`src/routes/`): Define API endpoints and map them to controllers

