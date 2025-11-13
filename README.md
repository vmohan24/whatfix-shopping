# Whatfix Shopping Dashboard

A React-based TypeScript dashboard application for a shopping site with a modular micro-frontend architecture.

## Features

- **TypeScript**: Fully typed application for better developer experience and type safety
- **Webpack Module Federation**: Configured for micro-frontend architecture
- **Dashboard Layout**: Header navigation, left sidebar, and main content area
- **Dynamic Configuration**: Loads navigation configuration from a backend API
- **Micro-frontend Support**: Each module is exposed via Module Federation and can be consumed by other apps
- **Routing**: React Router for navigation between modules
- **Lazy Loading**: Modules are lazy-loaded for better performance

## Project Structure

```
src/
  ├── components/
  │   ├── Dashboard.tsx      # Main container component
  │   ├── Header.tsx         # Header navigation component
  │   ├── LeftNav.tsx        # Left sidebar navigation
  │   └── MainContainer.tsx  # Main content area with routing
  ├── modules/               # Module components (micro-frontends)
  │   ├── Clothing.tsx
  │   ├── Electronics.tsx
  │   ├── Mobiles.tsx
  │   ├── Profile.tsx
  │   ├── Cart.tsx
  │   ├── Orders.tsx
  │   ├── Checkout.tsx
  │   └── Payment.tsx
  ├── services/
  │   └── api.ts            # API service for fetching configuration
  ├── types/
  │   └── config.ts          # TypeScript type definitions
  ├── main.tsx              # Application entry point
  └── index.css             # Global styles
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Build

```bash
npm run build
```

## Configuration

The dashboard configuration is fetched from `src/services/api.ts`. The configuration structure is defined in `src/types/config.ts` and includes:

- **headerConfig**: Navigation items for the header (Clothing, Electronics, Mobiles)
- **leftNavConfig**: Navigation items for the left sidebar (Profile, Cart, Orders)
- **secondaryConfig**: Secondary modules (Checkout, Payment) that can be invoked from other modules

All configuration types are fully typed with TypeScript interfaces for type safety.

## Micro-frontend Integration

This application uses **Webpack Module Federation** to expose modules that can be consumed by other micro-frontends. All modules in the `src/modules/` directory are exposed and can be dynamically loaded by other applications.

### Exposed Modules

- Dashboard, Clothing, Electronics, Mobiles
- Profile, Cart, Orders
- Checkout, Payment

To consume this remote in other applications, add to your webpack config:

```javascript
new ModuleFederationPlugin({
  remotes: {
    shopping_dashboard: 'shopping_dashboard@http://localhost:3000/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.20.0' },
  },
}),
```

## Technologies Used

- React 18
- TypeScript 5
- React Router DOM 6
- Webpack 5 with Module Federation
- CSS3

