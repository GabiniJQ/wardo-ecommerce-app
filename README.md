# 🛒 Wardo - Full-Stack E-commerce Platform

## 🌍 Available Languages
- 🇬🇧 English (this file)
- 🇪🇸 [Versión en español](README.es.md)

---

## 📋 Overview

Wardo is a **production-grade e-commerce application** built to demonstrate enterprise-level full-stack development practices. This project showcases modern web architecture, secure payment processing, and scalable state management patterns.

**Live Demo:** [Wardo Demo](https://wardo.vercel.app/) *(Hosted on Render free tier - initial load may take ~30s)*

## 🎥 Demo Preview
![Demo GIF](./Demo.gif)

---

## 🎯 Key Technical Achievements

### 💳 **Secure Payment Processing**
- ✅ **Stripe Payment Integration** (Payment Element, Stripe.js)
  - Backend-only payment confirmation to prevent client-side tampering
  - PCI SAQ-A compliant implementation using Stripe-hosted elements
  - Custom Payment Element styling for brand consistency
  - Webhook infrastructure for `payment_intent.succeeded` and `payment_intent.failed` events
  - Comprehensive error handling with user-friendly fallback messaging

### 🔐 **Enterprise Authentication System**
- JWT-based auth with **access/refresh token pattern**
  - Access tokens stored in memory (Redux)
  - Refresh tokens in HTTP-only cookies for XSS protection
- **Role-Based Access Control (RBAC)** with `user` and `admin` roles
- Protected routes on both frontend and backend
- Automatic token refresh flow

### 🏗️ **Advanced State Management**
- **Redux Toolkit** with domain-driven slice architecture
  - `createAsyncThunk` for async operations (auth, products, cart sync)
  - Centralized error handling via global error state
  - Client-side caching strategy for improved performance

### ⚡ **Performance Optimizations**
- React lazy loading for code splitting (checkout route)
- MongoDB indexing on high-query fields (product name, category, user ID)
- Planned: API response caching layer

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** + **TypeScript** (type-safe component architecture)
- **Redux Toolkit** (global state management with async thunks)
- **TailwindCSS** + **shadcn/ui** (modern, accessible component library)
- **React Router v7** (client-side routing with protected routes)
- **Zod** (runtime schema validation)
- **Stripe.js** + **Payment Element** (PCI-compliant payment UI)

### **Backend**
- **Node.js** + **Express.js** (RESTful API architecture)
- **MongoDB** + **Mongoose** (NoSQL data modeling)
- **JWT** (stateless authentication)
- **Stripe API** (payment processing)
- **Mailtrap** (email service integration)

### **Architecture Patterns**
- Custom error class (`AppError`) with centralized error middleware
- Database indexing strategy for query optimization
- Environment-based configuration management (dev, sandbox, production)

---

## 🚀 Features

### **Implemented**
- ✅ User registration and authentication with JWT refresh flow
- ✅ Protected routes with role-based authorization
- ✅ Product catalog with category filtering
- ✅ Persistent shopping cart with backend synchronization
- ✅ Multi-address management system
- ✅ **Stripe payment integration** with Payment Element
- ✅ Account management and profile updates

### **In Development**
- 🔄 OAuth 2.0 integration (Google Sign-In)
- 🔄 Order history with search/filtering
- 🔄 Admin dashboard (product/order management)
- 🔄 Optimistic UI updates for cart operations

---

## 📊 Project Metrics

- **Codebase Size:** ~12,000-15,000 lines of code
- **Development Timeline:** 3-4 months (part-time)
- **Database Collections:** 3 core models with relational references
- **API Endpoints:** 20+ RESTful endpoints

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 20+
- MongoDB instance
- Stripe account (test mode)

### 1. Clone Repository
```bash
git clone https://github.com/GabiniJQ/wardo-ecommerce-app.git
cd wardo-ecommerce-app

```

### 2. Environment Configuration

**Backend `.env`:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_RECAPTCHA_SITE_LOCALHOST_KEY=google_captcha_key
```

### 3. Install & Run

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing Strategy (Planned)

- **Unit Tests:** Jest for Redux reducers and utility functions
- **Integration Tests:** Auth flows and payment processing
- **E2E Tests:** Playwright/Cypress for complete checkout flow

---

## 🏆 Technical Challenges Solved

### **Secure Payment Flow Architecture**
Designed a backend-first payment confirmation system that:
- Prevents client-side payment tampering
- Synchronizes order state across database and Stripe
- Handles edge cases (duplicate charges, network failures)
- Maintains PCI compliance standards

### **JWT Refresh Token Implementation**
Built a seamless token refresh mechanism with:
- Automatic background token renewal
- Secure HTTP-only cookie storage
- Race condition handling for concurrent requests

### **Async State Consistency**
Managed complex async flows across multiple Redux slices while maintaining data integrity and preventing state desynchronization.

---

## 📈 Roadmap

- [ ] Implement CI/CD pipeline (GitHub Actions)
- [ ] Add comprehensive test suite (80%+ coverage target)
- [ ] Performance monitoring with logging infrastructure
- [ ] Advanced caching layer (Redis)
- [ ] Microservices architecture exploration

---

## 🧑‍💻 Author

**Jose Gabriel Quintana Guardo**  
Full-Stack Developer | E-commerce & Payment Systems Specialist

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/joseguardoq/)  
[![Portfolio](https://img.shields.io/badge/Portfolio-View-green)](https://josequintana.vercel.app/)

*Built as a comprehensive demonstration of modern full-stack development practices, with emphasis on security, scalability, and production-ready code quality.*

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Note:** This is an educational project demonstrating production-level development practices. While fully functional, it uses Stripe test mode and free-tier hosting.