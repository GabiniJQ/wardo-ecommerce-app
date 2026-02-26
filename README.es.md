# 🛒 Wardo - Plataforma E-commerce Full-Stack

## 🌍 Idiomas disponibles

* 🇬🇧 [English](README.md)
* 🇪🇸 Español (este archivo)

---

## 📋 Descripción general

Wardo es una **aplicación e-commerce de nivel productivo** construida para demostrar prácticas avanzadas de desarrollo full-stack a nivel empresarial. El proyecto muestra una arquitectura web moderna, procesamiento de pagos seguro, patrones escalables de manejo de estado y un **flujo de desarrollo containerizado**.

**Demo en vivo:** [Wardo Demo](https://wardo.vercel.app/) *(Alojado en Render free tier — la carga inicial puede tardar ~30s)*

## 🎥 Vista previa del demo

![Demo GIF](./Demo.gif)

▶️ **Ver demo completo (1 min):** [Video Demo](https://github.com/user-attachments/assets/60486783-7661-4de7-a171-e31893f1fa79)

---

## 🎯 Logros técnicos clave

### 💳 **Procesamiento de pagos seguro**

* ✅ **Integración con Stripe** (Payment Element, Stripe.js)

  * Confirmación de pagos exclusivamente desde el backend para evitar manipulaciones en el cliente
  * Implementación compatible con PCI SAQ-A usando componentes alojados por Stripe
  * Estilización personalizada del Payment Element para mantener consistencia de marca
  * Infraestructura de webhooks para eventos `payment_intent.succeeded` y `payment_intent.failed`
  * Manejo integral de errores con mensajes claros para el usuario

### 🔐 **Sistema de autenticación empresarial**

* Autenticación basada en JWT con **patrón access/refresh token**

  * Access tokens almacenados en memoria (Redux)
  * Refresh tokens en cookies HTTP-only para protección contra XSS
* **Control de acceso basado en roles (RBAC)** con roles `user` y `admin`
* Rutas protegidas tanto en frontend como en backend
* Flujo automático de renovación de tokens

### 🏗️ **Gestión avanzada de estado**

* **Redux Toolkit** con arquitectura de slices orientada al dominio

  * `createAsyncThunk` para operaciones asíncronas (auth, productos, sincronización del carrito)
  * Manejo centralizado de errores mediante un estado global
  * Estrategia de caché en cliente para mejorar el rendimiento

### ⚡ **Optimizaciones de rendimiento**

* Lazy loading en React para división de código (ruta de checkout)
* Indexación en MongoDB sobre campos de alta consulta (nombre de producto, categoría, ID de usuario)
* Planeado: capa de caché para respuestas de la API

### 🐳 **Flujo de desarrollo containerizado**

* Entorno de desarrollo local dockerizado usando **Docker Compose**
* Orquestación de múltiples servicios (frontend, backend, base de datos)
* Hot reload habilitado mediante Docker Compose Watch
* Herramientas consistentes entre entornos sin conflictos de dependencias locales

---

## 🛠️ Stack tecnológico

### **Frontend**

* **React 19** + **TypeScript** (arquitectura de componentes con tipado seguro)
* **Redux Toolkit** (gestión de estado global con thunks asíncronos)
* **TailwindCSS** + **shadcn/ui** (biblioteca de componentes moderna y accesible)
* **React Router v7** (enrutamiento del lado del cliente con rutas protegidas)
* **Zod** (validación de esquemas en tiempo de ejecución)
* **Stripe.js** + **Payment Element** (UI de pagos compatible con PCI)

### **Backend**

* **Node.js** + **Express.js** (arquitectura de API REST)
* **MongoDB** + **Mongoose** (modelado de datos NoSQL)
* **JWT** (autenticación sin estado)
* **Stripe API** (procesamiento de pagos)
* **Mailtrap** (integración de servicio de correo)

### **DevOps y herramientas**

* **Docker & Docker Compose Watch** (entorno de desarrollo containerizado)

### **Patrones de arquitectura**

* Clase de error personalizada (`AppError`) con middleware centralizado
* Estrategia de indexación en base de datos para optimización de consultas
* Configuración basada en entornos (dev, sandbox, production)

---

## 🚀 Funcionalidades

### **Implementadas**

* ✅ Registro y autenticación de usuarios con flujo de refresh tokens
* ✅ Rutas protegidas con autorización basada en roles
* ✅ Catálogo de productos con filtrado por categoría
* ✅ Carrito persistente con sincronización backend
* ✅ Sistema de gestión de múltiples direcciones
* ✅ **Integración de pagos con Stripe** usando Payment Element
* ✅ Gestión de cuenta y actualización de perfil

### **En desarrollo**

* 🔄 Integración OAuth 2.0 (Google Sign-In)
* 🔄 Historial de órdenes con búsqueda y filtros
* 🔄 Panel de administración (gestión de productos y órdenes)
* 🔄 Actualizaciones optimistas del carrito

---

## 📊 Métricas del proyecto

* **Tamaño del código:** ~12,000–15,000 líneas
* **Duración del desarrollo:** 3–4 meses (tiempo parcial)
* **Colecciones de base de datos:** 3 modelos principales con referencias relacionales
* **Endpoints de API:** 20+ endpoints REST

---

## 🔧 Instalación y configuración

Wardo puede ejecutarse mediante una configuración tradicional con Node.js o utilizando un entorno de desarrollo opcional con Docker.

### Requisitos (sin Docker)

* Node.js 20+
* Instancia de MongoDB
* Cuenta de Stripe (modo test)

### 1. Clonar el repositorio

```bash
git clone https://github.com/GabiniJQ/wardo-ecommerce-app.git
cd wardo-ecommerce-app
```

### 2. Configuración de variables de entorno

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

### 3. Instalar y ejecutar (sin Docker)

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

## 🐳 Entorno de desarrollo con Docker (opcional)

Wardo incluye un **entorno de desarrollo opcional con Docker** diseñado para simplificar la configuración local y garantizar consistencia entre equipos.

Este setup está pensado **exclusivamente para desarrollo** y replica el flujo tradicional con Node.js utilizando hot reload y volúmenes montados.
La containerización para producción se abordará en una etapa posterior.

### Servicios

* Frontend (React + Vite)
* Backend (Node.js + Express)
* MongoDB

### Ejecutar con Docker

```bash
docker compose up --build
```

### Acceso

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000](http://localhost:5000)

> Puedes alternar libremente entre flujos con Docker o sin Docker según tu preferencia.

---

## 🧪 Estrategia de testing (en desarrollo)

* **Tests unitarios:** Jest para reducers de Redux y utilidades
* **Tests de integración:** Flujos de autenticación y pagos
* **Tests E2E:** Playwright/Cypress para el flujo completo de checkout

---

## 🏆 Retos técnicos resueltos

### **Arquitectura segura de pagos**

Diseño de un flujo de confirmación de pagos centrado en el backend que:

* Evita manipulaciones del lado del cliente
* Sincroniza el estado de órdenes entre la base de datos y Stripe
* Maneja casos límite (cargos duplicados, fallos de red)
* Mantiene estándares de cumplimiento PCI

### **Implementación de refresh tokens con JWT**

Construcción de un mecanismo fluido de renovación de tokens con:

* Renovación automática en segundo plano
* Almacenamiento seguro en cookies HTTP-only
* Manejo de condiciones de carrera en solicitudes concurrentes

### **Consistencia de estado asíncrono**

Gestión de flujos asíncronos complejos entre múltiples slices de Redux manteniendo la integridad de los datos y evitando desincronizaciones.

---

## 📈 Roadmap

* [ ] Implementar pipeline CI/CD (GitHub Actions)
* [ ] Monitoreo de rendimiento con infraestructura de logging
* [ ] Capa avanzada de caché (Redis)
* [ ] Exploración de arquitectura de microservicios

---

## 🧑‍💻 Autor

**Jose Gabriel Quintana Guardo**
Desarrollador Full-Stack

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/joseguardoq/)
[![Portfolio](https://img.shields.io/badge/Portfolio-View-green)](https://josequintana.vercel.app/)

*Construido como una demostración integral de prácticas modernas de desarrollo full-stack, con énfasis en seguridad, escalabilidad y calidad de código lista para producción.*

---

## 📄 Licencia

Este proyecto es open source y está disponible bajo la licencia [MIT](LICENSE).

---

**Nota:** Este es un proyecto educativo que demuestra prácticas de desarrollo a nivel productivo. Aunque es totalmente funcional, utiliza Stripe en modo test y servicios de hosting en free tier.
