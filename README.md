# 🏡 Million – Sistema Completo de Gestión de Propiedades

## 📦 Descripción General

**Million** es una plataforma completa para la **gestión de propiedades inmobiliarias**, compuesta por:

- **Backend API** (.NET 9 + MongoDB)
- **Frontend Web** (Next.js 15 + Tailwind CSS + Zustand)

Ambos se ejecutan de forma integrada para listar, filtrar y visualizar propiedades, mostrando detalles del propietario, imágenes y trazas de ventas.

---

## 🧭 Estructura del Proyecto

```
.
├── Backend/                 # API REST (.NET 9 + MongoDB)
│   ├── Backend.API/          # Controladores (Swagger incluido)
│   ├── Backend.Application/  # Lógica de negocio
│   ├── Backend.Domain/       # Entidades
│   ├── Backend.Infrastructure/ # Repositorios MongoDB
│
├── Frontend/                # Interfaz Web (Next.js + Zustand)
│   ├── app/
│   ├── components/
│   └── services/
│
├── docker/                  # Dockerfiles y configuración Compose
│
└── mongo_mocks/             # Datos JSON mock para MongoDB
```

---

## ⚙️ Requisitos Previos

Para ejecutar con Docker solo necesitas:

- **Docker** ≥ 24  
- **Docker Compose Plugin** incluido

Para ejecución manual (sin Docker):

- **Node.js ≥ 18**
- **.NET SDK ≥ 9.0**
- **MongoDB ≥ 6.0**

---

## 🚀 OPCIÓN 1 — EJECUCIÓN AUTOMÁTICA (RECOMENDADA) 🐳

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/KleinBrun/Million.git
cd Million/docker
```

### 2️⃣ Levantar todos los servicios

```bash
docker compose up -d --build
```

Esto construirá y levantará:

| Servicio | Puerto local | Descripción |
|-----------|--------------|--------------|
| 🧱 `mongodb` | `27017` | Base de datos MongoDB con seed automático |
| ⚙️ `api` | `5228` | API .NET con Swagger |
| 💻 `web` | `3001` | Frontend Next.js |

### 3️⃣ Comprobar que todo está arriba

```bash
docker compose ps
```

Debes ver algo similar a:

```
million-api       Up  (0.0.0.0:5228->8080/tcp)
million-web       Up  (0.0.0.0:3001->3000/tcp)
million-mongodb   Up  (0.0.0.0:27017->27017/tcp)
```

### 4️⃣ Probar la aplicación

- **Swagger Backend:** 👉 [http://localhost:5228/swagger](http://localhost:5228/swagger)
- **Frontend:** 👉 [http://localhost:3001](http://localhost:3001)

El frontend y la API estarán conectados automáticamente.  
El contenedor de Mongo se inicializa con datos mock desde `mongo_mocks/`.

---

## 🧩 OPCIÓN 2 — EJECUCIÓN MANUAL (DESARROLLO LOCAL)

### 🔹 Backend

```bash
cd Backend
dotnet restore
dotnet run --project Backend.API
```

Swagger disponible en [http://localhost:5228/swagger](http://localhost:5228/swagger)

Si es la primera vez, importa los datos de prueba:

```bash
mongoimport --db RealEstateDB --collection Properties --file mongo_mocks/properties.json --jsonArray
mongoimport --db RealEstateDB --collection Owners --file mongo_mocks/owners.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyImages --file mongo_mocks/propertyimages.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyTraces --file mongo_mocks/propertytraces.json --jsonArray
```

### 🔹 Frontend

```bash
cd Frontend
npm install
npm run dev
```

Abre 👉 [http://localhost:3000](http://localhost:3000)

Asegúrate de tener el archivo `Frontend/.env.local` con:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5228/api
```

---

## 🧪 Testing

```bash
# Backend
cd Backend
dotnet test

# Frontend
cd Frontend
npm test
```

---


## ❌ Manejo de Errores
Se incluye la visualizacion en el front en los casos que no trae informacion el back(id no existente o fetch fallando). 

## 🧠 Tecnologías Clave

| Categoría | Tecnología | Versión |
|------------|-------------|---------|
| Backend | .NET 9 | ✅ |
| Frontend | Next.js 15.5.6 | ✅ |
| Base de Datos | MongoDB | ✅ |
| UI | Tailwind CSS | ✅ |
| Estado | Zustand | ✅ |
| Infraestructura | Docker + Compose | ✅ |

---

## 🧩 Endpoints Principales

| Método | Endpoint | Descripción |
|---------|-----------|-------------|
| `GET` | `/api/Property` | Lista de propiedades |
| `GET` | `/api/Property/{id}` | Detalle de una propiedad |
| `GET` | `/ping` | Healthcheck |

---

## 🧠 Troubleshooting

| Problema | Solución |
|-----------|-----------|
| MongoDB sin datos | Espera unos segundos tras el primer `up`; el seed se ejecuta en el entrypoint. |
| Swagger sin respuesta | Revisa que la API esté levantada (`docker compose logs api`). |
| Front sin conexión al back | Asegúrate de tener `NEXT_PUBLIC_API_BASE_URL` apuntando a `http://localhost:5228/api` o usa el proxy incluido. |

---

## 📸 Capturas

En la carpeta **`Capturas/`** encontrarás imágenes del sistema en funcionamiento.

---

## 👨‍💻 Autor

**Desarrollado por Klein Brun González**  
📧 [kleinbrun1997@gmail.com](mailto:kleinbrun1997@gmail.com)  
🌐 [GitHub](https://github.com/kleinbrun1997)
