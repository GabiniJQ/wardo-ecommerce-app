
# 🛒 Wardo - E-commerce App

Wardo es una aplicación full-stack tipo e-commerce desarrollada como proyecto personal con fines didácticos. Permite explorar productos, gestionar autenticación, realizar compras simuladas y más.

---

## 🚀 Features

- 🧾 Registro e inicio de sesión 
- 🔐 Autenticación con JWT y protección de rutas
- 📦 Catálogo de productos por categoría
- 🛍️ Carrito de compras persistente
- 🏠 Gestión de direcciones
- 🧾 Checkout (en desarrollo: integración con pasarela de pagos sandbox)
- ⚙️ Gestión de datos de la cuenta

---

## 🧱 Tech Stack

**Frontend**  
- React + TypeScript  
- Redux Toolkit (estado global)  
- TailwindCSS + shadcn/ui  
- React Router
- Zod para validaciones  

**Backend**  
- Node.js + Express  
- MongoDB + Mongoose  
- JWT para autenticación  
- Mailtrap

---

## 🔧 Instalación y Uso

1. Clonar el repositorio:
```bash
git clone https://github.com/GabiniJQ/wardo.git
```

2. Configura las variables de entorno (`.env`) para frontend y backend.

3. Instalar dependencias y levantar ambos servidores:
```bash
# En frontend
npm install
npm run dev

# En backend
npm install
npm run dev
```

---

## 📦 Futuras Mejoras

- Google OAuth para inicio de sesión/registro
- Integración de pasarelas de pago (Skrill, PSE sandbox)
- Historial de pedidos y de búsquedas
- Panel administrativo completo

---

## 🧑‍💻 Autor

Desarrollado por [Jose Gabriel Quintana Guardo](https://www.linkedin.com/in/joseguardoq/) — Proyecto personal con fines de aprendizaje.
