# Northwind E-Commerce Platform

A full-stack e-commerce web application featuring user authentication, product management, checkout, order tracking, and integrated chat & video support.

## 📖 About The Project

### What it does
Northwind is a complete, modern e-commerce storefront that allows users to browse products, add them to their cart, securely check out, and manage their orders. Beyond standard e-commerce functionality, it provides a comprehensive admin dashboard for managing the product catalog and observing platform activity.

### How it works
The platform is built on a scalable split architecture:
- **The Frontend** is a responsive, highly-interactive React application built with Vite and styled with Tailwind CSS, ensuring a fast and fluid user experience.
- **The Backend** is an Express-powered Node.js API connected to a PostgreSQL database via Drizzle ORM, providing robust and type-safe data handling.
- It leverages **external microservices** to handle complex operations: Clerk for secure identity management, Polar for processing payments seamlessly, ImageKit for optimized media delivery, and Stream for real-time communication features.

### The Problem it solves
Traditional e-commerce platforms often suffer from poor post-purchase customer support and rigid communication channels. Northwind tackles this by integrating **real-time chat and video calls directly into the order management system**. This allows customers to communicate with support or sellers immediately regarding their specific orders without leaving the platform, streamlining dispute resolution, product inquiries, and customer service.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS & DaisyUI
- **State Management:** Zustand
- **Routing:** React Router v7
- **Data Fetching:** React Query (`@tanstack/react-query`)
- **Authentication:** Clerk React SDK
- **Communication:** Stream Chat & Stream Video React SDKs
- **Monitoring:** Sentry

### Backend
- **Framework:** Node.js with Express.js & TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Clerk Express SDK
- **Payments & Checkouts:** Polar Webhooks
- **Media/Storage:** ImageKit
- **Monitoring:** Sentry for Node
- **Scheduling:** node-cron

## 📁 Project Structure

The repository is organized into a `frontend` and `backend` architecture, with Docker support.

### `/frontend`
- `src/components/`: Reusable UI components (Navbar, Footer, Layout, PageLoader, etc.)
- `src/pages/`: Application views (HomePage, CartPage, ProductDetailPage, OrdersPage, AdminProductsPage, OrderChatPage, OrderVideoPage, etc.)
- `src/store/`: Zustand state management modules
- `src/hooks/`: Custom React hooks
- `src/lib/`: Library configurations and wrappers (e.g., ImageKit setup)
- `src/utils/`: Helper functions and utilities
- `index.html` & `vite.config.js`: Vite and entry configurations

### `/backend`
- `src/routes/`: Express route handlers (`/api/products`, `/api/checkout`, `/api/orders`, `/api/admin`, `/api/me`, `/api/stream`)
- `src/controllers/`: Business logic for handling requests
- `src/db/`: Drizzle ORM setup, schema definitions, and database connection
- `src/middleware/`: Custom Express middlewares (e.g., Clerk Auth, Sentry user tracking)
- `src/webhooks/`: Webhook handlers for external services (Clerk for user syncing, Polar for payment processing)
- `src/lib/`: Utilities, environment configurations, and cron jobs
- `scripts/`: Seeding scripts for the database (`seed.ts`)
- `instrument.ts`: Sentry instrumentation setup
- `drizzle.config.ts`: Drizzle ORM configuration

## ✨ Key Features
- **User Authentication:** Secure sign-up, login, and user session management via Clerk.
- **Product Management:** Admin dashboard to create, view, update, and manage products.
- **Shopping Cart & Checkout:** Add items to the cart and process secure checkouts using Polar.
- **Order Management:** View order summaries and track order history in dedicated dashboards.
- **Real-time Chat & Video:** Integrated Stream SDKs provide order-specific real-time chat and video call capabilities between users and support/admins.
- **Robust Error Tracking:** Sentry is fully integrated across both frontend and backend to capture errors, profile performance, and track issues.
- **Image Optimization:** Integrates ImageKit for fast and efficient image delivery and storage.
- **Docker Support:** Includes a `Dockerfile` at the root for containerized deployments.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Accounts and API Keys for:
  - Clerk
  - Polar
  - Stream
  - Sentry
  - ImageKit

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd NORTHWIND
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Variables:**
   Create `.env` files in both the `frontend` and `backend` directories with the necessary API keys and configurations (e.g., Clerk keys, Postgres URL, Polar secret, Stream keys, Sentry DSN, ImageKit keys).

5. **Database Setup:**
   From the `backend` directory, push the schema and seed the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

6. **Run the Application Locally:**
   - **Backend:** Open a terminal in the `backend` folder and run `npm run dev` to start the server (uses `tsx watch`).
   - **Frontend:** Open another terminal in the `frontend` folder and run `npm run dev` to start the Vite development server.

---
*Generated automatically based on project structure and dependencies.*
