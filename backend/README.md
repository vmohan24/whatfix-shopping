# Whatfix Shopping Backend

Express.js backend API for the Whatfix Shopping application, structured using the MVC (Model-View-Controller) pattern. The backend provides RESTful APIs for product catalog, shopping cart, order management, and dashboard configuration.

## Project Structure

```
backend/
├── src/
│   ├── models/              # Data models and business logic
│   │   ├── Product.ts       # Product catalog model
│   │   ├── Cart.ts          # Shopping cart model
│   │   ├── Order.ts         # Order model
│   │   ├── DashboardConfig.ts  # Dashboard configuration model
│   │   └── Interest.ts      # User interest tracking model
│   ├── controllers/         # Request handlers
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   ├── orderController.ts
│   │   └── configController.ts
│   ├── routes/              # API route definitions
│   │   ├── productRoutes.ts
│   │   ├── cartRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── configRoutes.ts
│   ├── middleware/          # Express middleware
│   │   └── userMiddleware.ts  # User ID extraction middleware
│   ├── app.ts               # Express app configuration
│   └── server.ts            # Server entry point
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

The server will start on `http://localhost:4001` (or the PORT specified in environment variables).

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

All API endpoints require a `userId` header for user identification. The `userMiddleware` automatically extracts the `userId` from request headers.

### Products

#### Get All Products
- **URL:** `/api/products`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Classic White T-Shirt",
        "price": 29.99,
        "image": "👕",
        "category": "Tops",
        "subCategory": "T-Shirts"
      }
    ]
  }
  ```

#### Get Products by Category
- **URL:** `/api/products/:category`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Parameters:** `category` (clothing, electronics, mobiles)
- **Response:**
  ```json
  {
    "success": true,
    "data": [...]
  }
  ```

#### Get Product Details
- **URL:** `/api/products/:category/:productId`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Classic White T-Shirt",
      "price": 29.99,
      "image": "👕",
      "category": "Tops",
      "subCategory": "T-Shirts"
    }
  }
  ```

### Cart

#### Get User's Cart
- **URL:** `/api/cart`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "product": { ... },
        "quantity": 2
      }
    ]
  }
  ```

#### Add Item to Cart
- **URL:** `/api/cart`
- **Method:** `POST`
- **Headers:** `userId: <user-id>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "product": { ... },
      "quantity": 2
    }
  }
  ```

#### Update Cart Item Quantity
- **URL:** `/api/cart/:productId`
- **Method:** `PUT`
- **Headers:** `userId: <user-id>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "quantity": 3
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "product": { ... },
      "quantity": 3
    },
    "message": "Cart item updated"
  }
  ```

#### Remove Item from Cart
- **URL:** `/api/cart/:productId`
- **Method:** `DELETE`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Item removed from cart"
  }
  ```

#### Clear Entire Cart
- **URL:** `/api/cart`
- **Method:** `DELETE`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Cart cleared"
  }
  ```

#### Get Product Quantity in Cart
- **URL:** `/api/cart/:productId/quantity`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "productId": 1,
      "quantity": 2
    }
  }
  ```

### Orders

#### Create Order
- **URL:** `/api/orders`
- **Method:** `POST`
- **Headers:** `userId: <user-id>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "shippingInfo": {
      "fullName": "John Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "United States"
    },
    "paymentInfo": {
      "cardNumber": "1234 5678 9012 3456",
      "cardName": "John Doe",
      "expiryDate": "12/25",
      "cvv": "123"
    }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "ORD-1234567890-1",
      "userId": "user123",
      "items": [...],
      "shippingInfo": { ... },
      "paymentInfo": { ... },
      "subtotal": 100.00,
      "tax": 8.00,
      "total": 108.00,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "status": "pending"
    }
  }
  ```
- **Note:** This endpoint automatically clears the user's cart after order creation.

#### Get All Orders
- **URL:** `/api/orders`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "ORD-1234567890-1",
        "userId": "user123",
        "items": [...],
        "shippingInfo": { ... },
        "paymentInfo": { ... },
        "subtotal": 100.00,
        "tax": 8.00,
        "total": 108.00,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "status": "pending"
      }
    ]
  }
  ```

#### Get Order by ID
- **URL:** `/api/orders/:orderId`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "ORD-1234567890-1",
      "userId": "user123",
      "items": [...],
      "shippingInfo": { ... },
      "paymentInfo": { ... },
      "subtotal": 100.00,
      "tax": 8.00,
      "total": 108.00,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "status": "pending"
    }
  }
  ```

### Configuration

#### Get Dashboard Configuration
- **URL:** `/api/config`
- **Method:** `GET`
- **Headers:** `userId: <user-id>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "headerConfig": {
        "clothing": {
          "label": "Clothing",
          "path": "/shopping/clothing"
        }
      },
      "leftNavConfig": {
        "profile": {
          "label": "Profile",
          "path": "/profile"
        },
        "cart": {
          "label": "Cart",
          "path": "/cart"
        },
        "orders": {
          "label": "Orders",
          "path": "/orders"
        }
      },
      "secondaryConfig": {
        "checkout": {
          "label": "Checkout",
          "path": "/cart/checkout"
        }
      }
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

## Data Models

### Product
- `id`: number
- `name`: string
- `price`: number
- `image`: string (emoji)
- `category`: string
- `subCategory`: string

### CartItem
- `product`: Product
- `quantity`: number

### Order
- `id`: string (format: ORD-{timestamp}-{counter})
- `userId`: string
- `items`: OrderItem[]
- `shippingInfo`: ShippingInfo
- `paymentInfo`: PaymentInfo
- `subtotal`: number
- `tax`: number (8% of subtotal)
- `total`: number
- `createdAt`: Date
- `status`: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

### ShippingInfo
- `fullName`: string
- `address`: string
- `city`: string
- `state`: string
- `zipCode`: string
- `country`: string

### PaymentInfo
- `cardNumber`: string
- `cardName`: string
- `expiryDate`: string
- `cvv`: string

## Data Storage

Currently, the application uses **in-memory storage**:
- Products: Static data defined in `ProductModel`
- Carts: Stored per user in memory (Map structure)
- Orders: Stored per user in memory (Map structure)

**Important**: Data is lost on server restart. For production, implement persistent storage (database).

## Environment Variables

- `PORT` - Server port (default: 4001)

## MVC Architecture

- **Models** (`src/models/`): Define data structures and business logic
  - Handle data operations (CRUD)
  - Manage in-memory storage
  - Implement business rules

- **Controllers** (`src/controllers/`): Handle HTTP requests and responses
  - Validate request data
  - Call model methods
  - Format responses
  - Handle errors

- **Routes** (`src/routes/`): Define API endpoints and map them to controllers
  - Define URL patterns
  - Map HTTP methods to controller functions
  - Apply middleware

- **Middleware** (`src/middleware/`): Process requests before they reach controllers
  - `userMiddleware`: Extracts `userId` from headers and attaches to request object

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for order creation)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing userId)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### TypeScript

The backend is fully written in TypeScript. Type definitions are available for all models and interfaces.

### Code Organization

- Each feature (products, cart, orders) has its own:
  - Model file
  - Controller file
  - Routes file

This makes the codebase modular and easy to maintain.

## Testing

To test the API endpoints, you can use:
- Postman
- curl
- Any HTTP client

Example curl request:
```bash
curl -X GET http://localhost:4001/api/products \
  -H "userId: user123"
```

## Future Enhancements

Consider implementing:
- Database persistence (PostgreSQL, MongoDB, etc.)
- Authentication and authorization (JWT tokens)
- Input validation middleware
- Rate limiting
- Logging and monitoring
- Unit and integration tests
- API documentation (Swagger/OpenAPI)
