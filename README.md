# 🛒 Wardo - E-commerce App

## 🌍 Available Languages

- 🇬🇧 English (this file)
- 🇪🇸 [Versión en español](README.es.md)

Wardo is a full-stack e-commerce application developed as a personal, educational project. It allows users to explore products, manage authentication, simulate purchases, and more.

## 🎥 Demo Preview (GIF)

![Demo GIF](./Demo.gif)

---

## 🚀 Features

- 🧾 User registration and login
- 🔐 JWT-based authentication and route protection
- 📦 Product catalog by category
- 🛍️ Persistent shopping cart
- 🏠 Address management
- 🧾 Checkout (in progress: sandbox payment gateway integration)
- ⚙️ Account data management

---

## 🧱 Tech Stack

**Frontend**  
- React + TypeScript  
- Redux Toolkit (global state management)  
- TailwindCSS + shadcn/ui  
- React Router  
- Zod for validations

**Backend**  
- Node.js + Express  
- MongoDB + Mongoose  
- JWT for authentication  
- Mailtrap

---

## 🔧 Installation & Usage

1. Clone the repository:
```bash
git clone https://github.com/GabiniJQ/wardo.git
```

2. Configure the environment variables (`.env`) for both frontend and backend.

3. Install dependencies and run both servers:
```bash
# Frontend
npm install
npm run dev

# Backend
npm install
npm run dev
```

---

## 📦 Planned Improvements

- Google OAuth for log in/sign up
- Integration of payment gateways (Skrill, PSE sandbox)
- Order and search history
- Full admin panel

---

## 🧑‍💻 Author

Developed by [Jose Gabriel Quintana Guardo](https://www.linkedin.com/in/joseguardoq/) — A personal project built for learning purposes.
