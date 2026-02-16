# 🛒 Wardo - Plataforma E-commerce Full-Stack

## 🌍 Idiomas Disponibles
- 🇪🇸 Español (este archivo)
- 🇬🇧 [English version](README.md)

---

## 📋 Descripción General

Wardo es una **aplicación de e-commerce de nivel producción** construida para demostrar prácticas de desarrollo full-stack de nivel empresarial. Este proyecto exhibe arquitectura web moderna, procesamiento seguro de pagos y patrones escalables de gestión de estado.

**Demo en Vivo:** [Wardo Demo](https://wardo.vercel.app/) *(Alojado en tier gratuito de Render - la carga inicial puede tomar ~30s)*

## 🎥 Vista Previa de la Demo
![Demo GIF](./Demo.gif)

---

## 🎯 Logros Técnicos Clave

### 💳 **Procesamiento Seguro de Pagos**
- ✅ **Integración de Pagos con Stripe** (Payment Element, Stripe.js)
  - Confirmación de pagos exclusivamente en backend para prevenir manipulación del lado del cliente
  - Implementación compatible con PCI SAQ-A usando elementos alojados por Stripe
  - Personalización del estilo del Payment Element para consistencia de marca
  - Infraestructura de webhooks para eventos `payment_intent.succeeded` y `payment_intent.failed`
  - Manejo integral de errores con mensajes de respaldo amigables para el usuario

### 🔐 **Sistema de Autenticación Empresarial**
- Autenticación basada en JWT con **patrón de access/refresh token**
  - Access tokens almacenados en memoria (Redux)
  - Refresh tokens en cookies HTTP-only para protección XSS
- **Control de Acceso Basado en Roles (RBAC)** con roles `user` y `admin`
- Rutas protegidas en frontend y backend
- Flujo automático de renovación de tokens

### 🏗️ **Gestión Avanzada de Estado**
- **Redux Toolkit** con arquitectura de slices orientada a dominio
  - `createAsyncThunk` para operaciones asíncronas (auth, productos, sincronización de carrito)
  - Manejo centralizado de errores vía estado global de errores
  - Estrategia de caché del lado del cliente para mejorar el rendimiento

### ⚡ **Optimizaciones de Rendimiento**
- Lazy loading de React para code splitting (ruta de checkout)
- Indexación en MongoDB en campos de alta consulta (nombre de producto, categoría, ID de usuario)
- Planificado: Capa de caché de respuestas API

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 19** + **TypeScript** (arquitectura de componentes con tipado seguro)
- **Redux Toolkit** (gestión de estado global con async thunks)
- **TailwindCSS** + **shadcn/ui** (biblioteca de componentes moderna y accesible)
- **React Router v7** (enrutamiento del lado del cliente con rutas protegidas)
- **Zod** (validación de esquemas en tiempo de ejecución)
- **Stripe.js** + **Payment Element** (UI de pagos compatible con PCI)

### **Backend**
- **Node.js** + **Express.js** (arquitectura API RESTful)
- **MongoDB** + **Mongoose** (modelado de datos NoSQL)
- **JWT** (autenticación sin estado)
- **Stripe API** (procesamiento de pagos)
- **Mailtrap** (integración de servicio de correo electrónico)

### **Patrones de Arquitectura**
- Clase de error personalizada (`AppError`) con middleware centralizado de errores
- Estrategia de indexación de base de datos para optimización de consultas
- Gestión de configuración basada en entornos (dev, sandbox, production)

---

## 🚀 Funcionalidades

### **Implementadas**
- ✅ Registro de usuarios y autenticación con flujo de JWT refresh
- ✅ Rutas protegidas con autorización basada en roles
- ✅ Catálogo de productos con filtrado por categoría
- ✅ Carrito de compras persistente con sincronización en backend
- ✅ Sistema de gestión de múltiples direcciones
- ✅ **Integración de pagos con Stripe** con Payment Element
- ✅ Gestión de cuenta y actualizaciones de perfil

### **En Desarrollo**
- 🔄 Integración OAuth 2.0 (Google Sign-In)
- 🔄 Historial de pedidos con búsqueda/filtrado
- 🔄 Panel de administración (gestión de productos/pedidos)
- 🔄 Actualizaciones optimistas de UI para operaciones de carrito

---

## 📊 Métricas del Proyecto

- **Tamaño del Código:** ~12,000-15,000 líneas de código
- **Línea de Tiempo de Desarrollo:** 3-4 meses (tiempo parcial)
- **Colecciones de Base de Datos:** 3 modelos principales con referencias relacionales
- **Endpoints API:** Más de 20 endpoints RESTful

---

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 20+
- Instancia de MongoDB
- Cuenta de Stripe (modo de prueba)

### 1. Clonar Repositorio
```bash
git clone https://github.com/GabiniJQ/wardo-ecommerce-app.git
cd wardo-ecommerce-app
```

### 2. Configuración de Entorno

**Backend `.env`:**
```env
MONGODB_URI=tu_cadena_de_conexión_mongodb
JWT_ACCESS_SECRET=tu_secreto_de_access
JWT_REFRESH_SECRET=tu_secreto_de_refresh
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
STRIPE_WEBHOOK_SECRET=tu_secreto_webhook
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=tu_clave_publicable_stripe
VITE_RECAPTCHA_SITE_LOCALHOST_KEY=clave_google_captcha
```

### 3. Instalar y Ejecutar

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

## 🧪 Estrategia de Testing (Planificado)

- **Tests Unitarios:** Jest para reducers de Redux y funciones utilitarias
- **Tests de Integración:** Flujos de autenticación y procesamiento de pagos
- **Tests E2E:** Playwright/Cypress para flujo completo de checkout

---

## 🏆 Desafíos Técnicos Resueltos

### **Arquitectura de Flujo de Pago Seguro**
Diseñé un sistema de confirmación de pagos centrado en backend que:
- Previene la manipulación de pagos del lado del cliente
- Sincroniza el estado de pedidos entre base de datos y Stripe
- Maneja casos extremos (cargos duplicados, fallos de red)
- Mantiene estándares de cumplimiento PCI

### **Implementación de JWT Refresh Token**
Construí un mecanismo de renovación de tokens sin interrupciones con:
- Renovación automática de tokens en segundo plano
- Almacenamiento seguro en cookies HTTP-only
- Manejo de condiciones de carrera para solicitudes concurrentes

### **Consistencia de Estado Asíncrono**
Gestioné flujos asíncronos complejos a través de múltiples slices de Redux mientras mantenía la integridad de datos y prevenía la desincronización de estado.

---

## 📈 Hoja de Ruta

- [ ] Implementar pipeline CI/CD (GitHub Actions)
- [ ] Añadir suite de tests integral (objetivo de cobertura 80%+)
- [ ] Monitoreo de rendimiento con infraestructura de logging
- [ ] Capa de caché avanzada (Redis)
- [ ] Exploración de arquitectura de microservicios

---

## 🧑‍💻 Autor

**Jose Gabriel Quintana Guardo**  
Desarrollador Full-Stack | Especialista en E-commerce y Sistemas de Pago

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-blue)](https://www.linkedin.com/in/joseguardoq/)  
[![Portfolio](https://img.shields.io/badge/Portfolio-Ver-green)](https://josequintana.vercel.app/)

*Construido como una demostración integral de prácticas modernas de desarrollo full-stack, con énfasis en seguridad, escalabilidad y calidad de código listo para producción.*

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [Licencia MIT](LICENSE).

---

**Nota:** Este es un proyecto educativo que demuestra prácticas de desarrollo de nivel producción. Aunque es completamente funcional, utiliza el modo de prueba de Stripe y alojamiento en tier gratuito.