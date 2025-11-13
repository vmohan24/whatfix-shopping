# Whatfix Shopping Dashboard

A modern e-commerce shopping application built with React, TypeScript, and a micro-frontend architecture using Webpack Module Federation. The application features a complete shopping flow from product browsing to order management.

## 🚀 Features

- **Micro-frontend Architecture**: Modular, independently deployable frontend applications
- **Product Catalog**: Browse products by category (Clothing, Electronics, Mobiles)
- **Shopping Cart**: Add, update, and manage items in your cart
- **Checkout Process**: Complete checkout with shipping and payment information
- **Order Management**: View order history with detailed order information
- **Redux State Management**: Shared state across micro-frontends
- **TypeScript**: Fully typed application for better developer experience
- **Responsive Design**: Mobile-friendly UI with modern styling

## 📁 Project Structure

```
whatfix-shopping/
├── backend/                    # Express.js backend API
│   ├── src/
│   │   ├── models/            # Data models (Product, Cart, Order, etc.)
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Express middleware
│   │   ├── app.ts             # Express app configuration
│   │   └── server.ts          # Server entry point
│   └── package.json
│
├── src/                        # Main dashboard (host application)
│   ├── components/            # Dashboard components
│   │   ├── Dashboard.tsx     # Main container
│   │   ├── Header.tsx        # Header navigation
│   │   ├── LeftNav.tsx       # Left sidebar
│   │   └── MainContainer.tsx # Main content with routing
│   ├── store/                # Redux store (shared across apps)
│   │   ├── slices/           # Redux slices (cart, user)
│   │   └── store.ts          # Store configuration
│   ├── services/             # API services
│   ├── modules/              # Local module components
│   └── main.tsx              # Application entry point
│
├── product-category-app/      # Product browsing micro-frontend (Port 3001)
│   ├── src/
│   │   ├── ProductCategory.tsx
│   │   ├── ProductDetail.tsx
│   │   └── bootstrap.tsx
│   └── webpack.config.js
│
├── cart-app/                  # Shopping cart micro-frontend (Port 3002)
│   ├── src/
│   │   ├── Cart.tsx
│   │   └── bootstrap.tsx
│   └── webpack.config.js
│
├── checkout-app/              # Checkout micro-frontend (Port 3003)
│   ├── src/
│   │   ├── Checkout.tsx
│   │   ├── api.ts
│   │   └── bootstrap.tsx
│   └── webpack.config.js
│
├── orders-app/                # Orders micro-frontend (Port 3004)
│   ├── src/
│   │   ├── Orders.tsx
│   │   ├── api.ts
│   │   └── bootstrap.tsx
│   └── webpack.config.js
│
└── webpack.config.js          # Main dashboard webpack config
```

## 🏗️ Architecture

### Micro-frontend Architecture

The application uses **Webpack Module Federation** to create a micro-frontend architecture where:

- **Host Application** (Port 3000): Main dashboard that orchestrates all micro-frontends
- **Remote Applications**: Independent micro-frontends that can be developed and deployed separately
  - `product-category-app` (Port 3001): Product browsing and details
  - `cart-app` (Port 3002): Shopping cart management
  - `checkout-app` (Port 3003): Checkout process
  - `orders-app` (Port 3004): Order history and management

### Shared State Management

All micro-frontends share a common Redux store exposed by the host application:
- **Cart State**: Shopping cart items and quantities
- **User State**: Current user information
- **Store**: Exposed via Module Federation for consumption by remote apps

### Backend API

The backend (Port 4001) provides RESTful APIs for:
- **Products**: Product catalog and details
- **Cart**: Cart management (add, update, remove items)
- **Orders**: Order creation and retrieval
- **Configuration**: Dashboard navigation configuration

## 🛠️ Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whatfix-shopping
   ```

2. **Install dependencies for all applications**
   ```bash
   # Install main dashboard dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..

   # Install micro-frontend dependencies
   cd product-category-app && npm install && cd ..
   cd cart-app && npm install && cd ..
   cd checkout-app && npm install && cd ..
   cd orders-app && npm install && cd ..
   ```

## 🚀 Running the Application

### Development Mode

You need to run all applications simultaneously. Open multiple terminal windows:

**Terminal 1 - Backend API:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4001`

**Terminal 2 - Main Dashboard:**
```bash
npm run dev
```
Dashboard runs on `http://localhost:3000`

**Terminal 3 - Product Category App:**
```bash
cd product-category-app
npm run dev
```
Runs on `http://localhost:3001`

**Terminal 4 - Cart App:**
```bash
cd cart-app
npm run dev
```
Runs on `http://localhost:3002`

**Terminal 5 - Checkout App:**
```bash
cd checkout-app
npm run dev
```
Runs on `http://localhost:3003`

**Terminal 6 - Orders App:**
```bash
cd orders-app
npm run dev
```
Runs on `http://localhost:3004`

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📱 Application Flow

1. **Browse Products**: Navigate through product categories (Clothing, Electronics, Mobiles)
2. **View Product Details**: Click on any product to see detailed information
3. **Add to Cart**: Add products to your shopping cart with desired quantities
4. **Manage Cart**: View cart, update quantities, or remove items
5. **Checkout**: Proceed to checkout, enter shipping and payment information
6. **Place Order**: Complete the order, which is persisted in the backend
7. **View Orders**: Access order history to see all past orders with details

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:category` - Get products by category
- `GET /api/products/:category/:productId` - Get product details

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create a new order (from cart)
- `GET /api/orders` - Get all orders for user
- `GET /api/orders/:orderId` - Get specific order details

### Configuration
- `GET /api/config` - Get dashboard configuration

**Note**: All API endpoints require a `userId` header for user identification.

## 🎨 Technologies Used

### Frontend
- **React 18**: UI library
- **TypeScript 5**: Type safety
- **React Router DOM 6**: Client-side routing
- **Redux Toolkit**: State management
- **Webpack 5**: Module bundler with Module Federation
- **CSS3**: Styling

### Backend
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **CORS**: Cross-origin resource sharing
- **Node.js**: Runtime environment

## 🔐 User Management

The application uses a simple user identification system:
- User information is stored in Redux store
- `userId` header is sent with all API requests
- User middleware extracts `userId` from request headers

## 📦 Data Storage

Currently, the application uses **in-memory storage** for:
- Shopping carts (per user)
- Orders (per user)
- Product catalog (static data)

**Note**: Data is lost on server restart. For production, consider implementing persistent storage (database).

## 🧩 Module Federation Configuration

### Exposed Modules (Host)
- `./Dashboard` - Main dashboard component
- `./store` - Redux store (shared state)
- `./Profile`, `./Cart`, `./Orders`, `./Checkout`, `./Payment` - Module components

### Remote Modules
- `product_category_app@http://localhost:3001/remoteEntry.js`
- `cart_app@http://localhost:3002/remoteEntry.js`
- `checkout_app@http://localhost:3003/remoteEntry.js`
- `orders_app@http://localhost:3004/remoteEntry.js`

## 🧪 Development

### Building for Production

```bash
# Build main dashboard
npm run build

# Build backend
cd backend
npm run build

# Build micro-frontends
cd product-category-app && npm run build && cd ..
cd cart-app && npm run build && cd ..
cd checkout-app && npm run build && cd ..
cd orders-app && npm run build && cd ..
```

### Code Structure

- **Models**: Data structures and business logic (backend)
- **Controllers**: Request handlers (backend)
- **Routes**: API endpoint definitions (backend)
- **Components**: React components (frontend)
- **Services**: API service functions (frontend)
- **Store**: Redux state management (frontend)

## 📝 Features in Detail

### Shopping Cart
- Add products with quantities
- Update item quantities
- Remove items
- View cart total
- Persistent cart per user

### Checkout
- Shipping information form
- Payment information form
- Order summary
- Order creation and cart clearing
- Automatic redirect to orders page

### Orders
- View all past orders
- Order details including:
  - Order ID and date
  - Order status
  - Items with quantities
  - Shipping address
  - Order totals (subtotal, tax, total)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push to your branch
5. Create a pull request

## 📄 License

This project is part of the Whatfix Shopping application.

## 🔗 Related Documentation

- [Backend README](./backend/README.md) - Backend API documentation

---

**Note**: This is a development/demo application. For production use, consider:
- Implementing persistent database storage
- Adding authentication and authorization
- Implementing payment gateway integration
- Adding error monitoring and logging
- Setting up CI/CD pipelines
- Adding comprehensive testing
