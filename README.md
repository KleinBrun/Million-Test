# 🏡 Million – Sistema Completo de Gestión de Propiedades

## 📦 Descripción General

**Million** es una plataforma completa para la **gestión de propiedades inmobiliarias**, compuesta por dos proyectos principales:

-   **Backend API** (C# .NET 9 + MongoDB)
-   **Frontend Web** (Next.js 15 + Tailwind CSS + Zustand)

Ambos trabajan de forma integrada para ofrecer una experiencia fluida al listar, filtrar y visualizar propiedades, incluyendo información del propietario, imágenes y trazas históricas de ventas.

---

## 🧭 Estructura del Proyecto

```
.
├── Backend/            # API REST (.NET 9 + MongoDB)
│   ├── Backend.API/           # Capa de presentación (controllers)
│   ├── Backend.Application/   # Lógica de negocio
│   ├── Backend.Domain/        # Entidades
│   ├── Backend.Infrastructure/# Repositorios MongoDB
│   └── Backend.Tests/         # Pruebas unitarias
│
├── Frontend/           # Interfaz Web (Next.js + Zustand)
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── stores/
│
└── mongo_mocks/        # Datos JSON de prueba para MongoDB
```

---

## ⚙️ Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas:

-   **Node.js** ≥ 18
-   **pnpm** (recomendado) o npm/yarn
-   **.NET SDK 9.0+**
-   **MongoDB** (local o en la nube con MongoDB Atlas)

---

## 🧱 Configuración Inicial

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/KleinBrun/Million.git
cd Million
```

### 2️⃣ Configurar Variables de Entorno

#### 📍 Frontend (`Frontend/.env.local`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5228/api/Property
```

#### 📍 Backend (`Backend.API/appsettings.json`)

```json
{
	"ConnectionStrings": {
		"Mongo": "mongodb://localhost:27017"
	},
	"Mongo": {
		"Database": "RealEstateDB",
		"Collections": {
			"Properties": "Properties",
			"Owners": "Owners",
			"PropertyImages": "PropertyImages",
			"PropertyTraces": "PropertyTraces"
		}
	}
}
```

---

## 🧩 Ejecución de Ambos Proyectos

### 🚀 **1. Iniciar el Backend (.NET + MongoDB)**

```bash
cd Backend
dotnet restore
dotnet run --project Backend.API
```

-   API: [http://localhost:5228/api/Property](http://localhost:5228/api/Property)
-   Swagger: [http://localhost:5228/swagger](http://localhost:5228/swagger)

💡 **Nota:** Asegúrate de tener MongoDB ejecutándose en `mongodb://localhost:27017`  
Si es la primera vez, puedes importar los mocks:

```bash
mongoimport --db RealEstateDB --collection Properties --file mongo_mocks/properties.json --jsonArray
mongoimport --db RealEstateDB --collection Owners --file mongo_mocks/owners.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyImages --file mongo_mocks/propertyimages.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyTraces --file mongo_mocks/propertytraces.json --jsonArray
```

---

### 💻 **2. Iniciar el Frontend (Next.js)**

En otra terminal:

```bash
cd Frontend
pnpm install
pnpm dev
```

Luego abre tu navegador en:  
👉 [http://localhost:3000](http://localhost:3000)

El frontend consumirá automáticamente el backend configurado en el `.env.local`.

---

## 🧪 Testing

```bash
# Backend
cd Backend
dotnet test

# Frontend
cd Frontend
pnpm test
```

---

## 🌐 Endpoints Principales

| Método | Endpoint             | Descripción                       |
| ------ | -------------------- | --------------------------------- |
| `GET`  | `/api/Property`      | Lista paginada de propiedades     |
| `GET`  | `/api/Property/{id}` | Detalle completo de una propiedad |
| `GET`  | `/ping`              | Health check del backend          |

---

## 🧠 Tecnologías Clave

| Categoría     | Tecnología     | Versión |
| ------------- | -------------- | ------- |
| Backend       | .NET           | 9.0     |
| Base de datos | MongoDB        | —       |
| Frontend      | Next.js        | 15.5.6  |
| UI            | Tailwind CSS   | 3.4.18  |
| Estado        | Zustand        | 5.0.8   |
| Testing       | Vitest / NUnit | —       |

---

## 🧩 Cómo Probar Todo

1. Asegúrate de que **MongoDB** esté corriendo con la informacion suministrada.
2. Levanta el **backend** con `dotnet run`.
3. Levanta el **frontend** con `pnpm dev`.
4. Abre [http://localhost:3000](http://localhost:3000) y usa los filtros para explorar propiedades.

Si todo está correcto, deberías ver las propiedades mockeadas cargadas desde MongoDB.

En la carptea Capturas podemos ver imagenes del aplicativo.

---

## 📜 Autor

**Desarrollado por Klein Brun González**  
💻 [GitHub](https://github.com/kleinbrun1997) | ✉️ kleinbrun1997@gmail.com
