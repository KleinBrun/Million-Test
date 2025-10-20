# 🏠 Million - Frontend de Propiedades

## Descripción General

**Million** es una aplicación web frontend desarrollada en **Next.js 15** que proporciona una interfaz moderna y responsiva para la búsqueda, visualización y gestión de propiedades inmobiliarias.  
Permite a los usuarios explorar un catálogo de propiedades con filtros avanzados y ver detalles completos de cada propiedad.

---

## 🚀 Características Principales

### **Gestión de Propiedades**
- Listado paginado con filtros dinámicos (nombre, dirección y rango de precios)
- Vista detallada con galería de imágenes y datos del propietario
- Paginación configurable (6, 9, 12, 15, 18 ítems por página)

### **Interfaz de Usuario**
- Diseño 100% responsivo
- Animaciones suaves con **Framer Motion**
- Componentes reutilizables y estilizados con **Tailwind CSS**

### **Integración con Backend**
- Consumo de una **API REST** configurable mediante variables de entorno
- Manejo de errores y validación de respuestas JSON

---

## ⚙️ Tecnologías Principales

| Categoría | Tecnología |
|------------|-------------|
| Framework | Next.js 15.5.6 |
| Lenguaje | TypeScript 5 |
| Librería UI | React 19.1.0 |
| Estilos | Tailwind CSS 3.4.18 |
| Animaciones | Framer Motion 12.23.24 |
| Estado global | Zustand 5.0.8 |
| Testing | Vitest 3.2.4 + Testing Library |
| Iconografía | Lucide React 0.546.0 |

---

## 🧩 Arquitectura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── property/[id]/     # Detalles de propiedad
├── components/            # Componentes reutilizables
│   ├── detail/            # Componentes de detalle
│   ├── skeleton/          # Skeletons de carga
│   └── __tests__/         # Tests de componentes
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── stores/                # Estado global (Zustand)
├── types/                 # Tipos TypeScript
└── utils/                 # Utilidades auxiliares
```

---

## 🌐 Configuración de Variables de Entorno

El proyecto obtiene la URL base de la API desde variables de entorno para mayor flexibilidad entre entornos (desarrollo, staging, producción).

Crea un archivo **`.env.local`** en la raíz del proyecto y agrega:

```bash
# URL base de la API REST del backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5228/api/Property
```

### 🔸 Ejemplo para producción (`.env.production`)
```bash
NEXT_PUBLIC_API_BASE_URL=https://mi-servidor.com/api/Property
```

> ⚠️ En **Next.js**, las variables que deben estar disponibles en el navegador **deben comenzar con `NEXT_PUBLIC_`**.

El archivo `propertyService.ts` usará esta variable así:

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
```

---

## 🧠 Servicios de API

### **`propertyService.ts`**
- `getProperties()` → Obtiene una lista paginada de propiedades  
- `getPropertyById()` → Obtiene los detalles de una propiedad específica  
- Usa `fetch()` con validación JSON y manejo de errores

---

## 🧩 Hooks Personalizados

### **`usePropertySearch`**
Maneja:
- Filtros por nombre, dirección y precio (en millones de COP)
- Paginación
- Estado global sincronizado con **Zustand**
- Restauración automática del estado en la misma pestaña

### **`usePropertyDetail`**
- Carga datos de una propiedad
- Calcula hipotecas, maneja copia de ID y navegación

---

## 🧱 Estado Global (Zustand)

El store mantiene:
- Propiedades cargadas
- Filtros aplicados
- Página actual
- Persistencia con rehidratación automática

---

## 🧪 Testing

### **Vitest + Testing Library**
- Configuración de alias `@/`
- Entorno **JSDOM**
- Tests de integración y unitarios
- Setup automático con `setupTests.ts`

---

## ▶️ Cómo Iniciar el Proyecto

### **Prerrequisitos**
- Node.js 18+
- pnpm (recomendado) o npm/yarn

### **Instalación**
```bash
git clone <repository-url>
cd Frontend
pnpm install
pnpm dev
```
Abre en el navegador: `http://localhost:3000`

---

## 💻 Scripts Disponibles

```bash
# Desarrollo con Turbopack
pnpm dev

# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint

# Testing
pnpm test
```

---

**Desarrollado por Klein Brun**
