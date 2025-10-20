# 🏡 Real Estate System – Backend & Frontend

## 📦 Descripción General
Sistema completo para la **gestión de propiedades inmobiliarias**, compuesto por:

- **Backend API (.NET 9 + MongoDB)**
- **Frontend Web (Next.js + Tailwind + Zustand)**

Permite listar, filtrar y visualizar propiedades junto con sus propietarios, imágenes e historial de ventas.

---

## ⚙️ Backend – API REST (.NET 9)

### ✨ Funcionalidades
- CRUD y consulta paginada de propiedades  
- Filtros por nombre, dirección y rango de precios  
- Integración con propietarios, imágenes y trazas históricas  
- Documentación Swagger y endpoint de salud (`/ping`)

### 🧩 Stack
| Tecnología | Versión | Uso |
|-------------|----------|-----|
| .NET | 9.0 | Framework principal |
| MongoDB | — | Base de datos |
| Swashbuckle | 9.0.6 | Swagger/OpenAPI |
| NUnit | 4.4.0 | Testing |

### 🚀 Ejecución
```bash
dotnet restore
dotnet run --project Backend.API
```
- **API:** [https://localhost:5201](https://localhost:5201)  
- **Swagger:** [https://localhost:5201/swagger](https://localhost:5201/swagger)

---

## 🗄️ Configuración de Base de Datos (MongoDB)

### 📋 Conexión y Configuración
El backend utiliza **MongoDB** como base de datos NoSQL.  
Edita el archivo `Backend.API/appsettings.json` con esta configuración:

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

Además, en el archivo **`Program.cs`** se inicializa el cliente MongoDB con **inyección de dependencias**:

```csharp
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    var cs = cfg.GetConnectionString("Mongo") ?? cfg["Mongo:ConnectionString"] ?? "mongodb://localhost:27017";
    return new MongoClient(cs);
});
```

### 🧱 Colecciones Requeridas
| Colección | Descripción | Fuente de datos |
|------------|-------------|-----------------|
| **Properties** | Propiedades inmobiliarias con relación a dueños | `mongo_mocks/properties.json` |
| **Owners** | Propietarios de cada propiedad | `mongo_mocks/owners.json` |
| **PropertyImages** | Imágenes asociadas a cada propiedad | `mongo_mocks/propertyimages.json` |
| **PropertyTraces** | Historial de ventas y traspasos | `mongo_mocks/propertytraces.json` |

### 📂 Estructura de `mongo_mocks/`
```
mongo_mocks/
├── owners.json
├── properties.json
├── propertyimages.json
└── propertytraces.json
```

### 📦 Importar Datos de Prueba
Asegúrate de tener MongoDB en ejecución y luego importa las colecciones:

```bash
mongoimport --db RealEstateDB --collection Properties --file mongo_mocks/properties.json --jsonArray
mongoimport --db RealEstateDB --collection Owners --file mongo_mocks/owners.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyImages --file mongo_mocks/propertyimages.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyTraces --file mongo_mocks/propertytraces.json --jsonArray
```

Una vez importados, la base de datos quedará lista para que el backend funcione correctamente.

---

## 💻 Frontend – Million App (Next.js 15)

### ✨ Características
- Listado paginado y filtrado de propiedades  
- Vista detallada con galería, propietario e historial  
- Calculadora de hipoteca integrada  
- Diseño moderno y responsivo con animaciones

### 🧩 Stack
| Tecnología | Versión | Uso |
|-------------|----------|-----|
| Next.js | 15.5.6 | Framework principal |
| React | 19.1.0 | UI |
| Tailwind CSS | 3.4.18 | Estilos |
| Zustand | 5.0.8 | Estado global |
| Vitest + Testing Library | — | Testing |

### 🚀 Ejecución
```bash
pnpm install
pnpm dev
```
- **App:** [http://localhost:3000](http://localhost:3000)  
- **Backend requerido:** [http://localhost:5228/api/Property](http://localhost:5228/api/Property)

---

## 🧪 Testing
- **Backend:** pruebas unitarias de endpoints (`ping`, `property`)  
- **Frontend:** 42/42 tests pasando (servicios, store y persistencia)

```bash
# Backend
dotnet test

# Frontend
pnpm test
```

---

## 🧠 Arquitectura Global
```
📁 backend/   → API REST (C# + MongoDB)
📁 frontend/  → Interfaz (Next.js + Zustand)
📁 mongo_mocks/ → Datos de prueba para MongoDB
```

---

## 🛠️ Requisitos Previos
- Node.js 18+  
- .NET 9 SDK  
- MongoDB (local o Atlas)
