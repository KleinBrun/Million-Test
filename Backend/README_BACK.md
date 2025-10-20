# Backend API - Sistema de Gestión de Propiedades Inmobiliarias

## Descripción General

Este proyecto es una **API REST** desarrollada en **.NET 9** que proporciona servicios para la gestión de propiedades inmobiliarias. El sistema permite consultar propiedades con sus relaciones (propietarios, imágenes y trazas históricas) utilizando **MongoDB** como base de datos.

### Funcionalidades Principales

- **Gestión de Propiedades**: Consulta de propiedades inmobiliarias con filtros avanzados
- **Relaciones**: Integración de propietarios, imágenes y trazas históricas
- **Paginación**: Sistema de paginación para consultas eficientes
- **Filtros Dinámicos**: Búsqueda por nombre, dirección y rango de precios
- **API RESTful**: Endpoints estándar con documentación Swagger

## Arquitectura del Proyecto

El proyecto sigue una **arquitectura en capas (Clean Architecture)** con separación clara de responsabilidades:

```
Backend/
├── Backend.API/           # Capa de presentación (Controllers, Program.cs)
├── Backend.Application/   # Capa de aplicación (Services, DTOs, Interfaces)
├── Backend.Domain/        # Capa de dominio (Entidades)
├── Backend.Infrastructure/# Capa de infraestructura (Repositories, MongoDB)
└── Backend.Tests/         # Pruebas unitarias
```

### Detalles Técnicos por Capa

#### 1. **Backend.API** (Capa de Presentación)
- **Framework**: ASP.NET Core 9.0
- **Documentación**: Swagger/OpenAPI integrado
- **CORS**: Configurado para frontend en `http://localhost:3000`
- **Endpoints**:
  - `GET /api/property` - Lista paginada con filtros
  - `GET /api/property/{id}` - Propiedad específica con relaciones
  - `GET /ping` - Health check

#### 2. **Backend.Application** (Capa de Aplicación)
- **Servicios**: `PropertyService` - Lógica de negocio
- **DTOs**: Objetos de transferencia de datos
- **Interfaces**: `IPropertyService` - Contratos de servicios

#### 3. **Backend.Domain** (Capa de Dominio)
- **Entidades**:
  - `Property`: Propiedad inmobiliaria
  - `Owner`: Propietario
  - `PropertyImage`: Imágenes de propiedades
  - `PropertyTrace`: Trazas históricas de ventas

#### 4. **Backend.Infrastructure** (Capa de Infraestructura)
- **Repositorios**: Acceso a datos MongoDB
- **Driver**: MongoDB.Driver 3.5.0
- **Colecciones**: Properties, Owners, PropertyImages, PropertyTraces

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| .NET | 9.0 | Framework principal |
| ASP.NET Core | 9.0.10 | API REST |
| MongoDB.Driver | 3.5.0 | Acceso a base de datos |
| Swashbuckle.AspNetCore | 9.0.6 | Documentación Swagger |
| NUnit | 4.4.0 | Framework de pruebas |
| Microsoft.AspNetCore.OpenApi | 9.0.10 | OpenAPI/Swagger |

## Estructura de Datos

### Entidades Principales

#### Property (Propiedad)
```csharp
{
  "Id": "ObjectId",
  "IdProperty": "string",
  "Name": "string",
  "Address": "string", 
  "Price": "decimal",
  "CodeInternal": "string",
  "Year": "int",
  "IdOwner": "string"
}
```

#### Owner (Propietario)
```csharp
{
  "Id": "ObjectId",
  "IdOwner": "string",
  "Name": "string",
  "Address": "string",
  "Photo": "string?",
  "Birthday": "DateTime"
}
```

#### PropertyImage (Imagen de Propiedad)
```csharp
{
  "Id": "ObjectId",
  "IdPropertyImage": "string",
  "IdProperty": "string",
  "File": "string",
  "Enabled": "bool"
}
```

#### PropertyTrace (Trazas Históricas)
```csharp
{
  "Id": "ObjectId",
  "IdPropertyTrace": "string",
  "DateSale": "DateTime",
  "Name": "string",
  "Value": "decimal",
  "Tax": "decimal",
  "IdProperty": "string"
}
```

## Configuración de la Base de Datos

### MongoDB Collections

El sistema utiliza las siguientes colecciones en MongoDB:

- **Properties**: Propiedades inmobiliarias
- **Owners**: Propietarios
- **PropertyImages**: Imágenes de propiedades
- **PropertyTraces**: Trazas históricas de ventas

### Datos de Prueba (mongo_mocks)

La carpeta `mongo_mocks/` contiene archivos JSON con datos de prueba que deben importarse a MongoDB:

- `properties.json` - Propiedades de ejemplo
- `owners.json` - Propietarios de ejemplo  
- `propertyimages.json` - Imágenes de propiedades
- `propertytraces.json` - Trazas históricas

## Instalación y Configuración

### Prerrequisitos

- **.NET 9 SDK** o superior
- **MongoDB** (local o remoto)
- **Visual Studio 2022** o **VS Code** (opcional)

### Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Backend
```

#### 2. Restaurar Dependencias
```bash
dotnet restore
```

#### 3. Configurar MongoDB

**Opción A: MongoDB Local**
```bash
# Instalar MongoDB localmente
# Windows: Descargar desde https://www.mongodb.com/try/download/community
# Linux: sudo apt-get install mongodb
# macOS: brew install mongodb-community

# Iniciar MongoDB
mongod
```

**Opción B: MongoDB Atlas (Cloud)**
- Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Obtener connection string
- Actualizar `appsettings.json` con la cadena de conexión

#### 4. Importar Datos de Prueba

```bash
# Importar cada colección
mongoimport --db RealEstateDB --collection Properties --file mongo_mocks/properties.json --jsonArray
mongoimport --db RealEstateDB --collection Owners --file mongo_mocks/owners.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyImages --file mongo_mocks/propertyimages.json --jsonArray
mongoimport --db RealEstateDB --collection PropertyTraces --file mongo_mocks/propertytraces.json --jsonArray
```

#### 5. Configurar Variables de Entorno

Editar `Backend.API/appsettings.json`:
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

#### 6. Ejecutar la Aplicación

```bash
# Desde la raíz del proyecto
dotnet run --project Backend.API

# O desde la carpeta Backend.API
cd Backend.API
dotnet run
```

La aplicación estará disponible en:
- **API**: `https://localhost:5201`
- **Swagger UI**: `https://localhost:5201` (raíz)
- **Health Check**: `https://localhost:5201/ping`

## Uso de la API

### Endpoints Disponibles

#### 1. Listar Propiedades con Filtros
```http
GET /api/property?name=Loft&address=Barranquilla&minPrice=1000000&maxPrice=2000000&page=1&pageSize=10
```

**Parámetros de Query:**
- `name` (opcional): Filtro por nombre de propiedad
- `address` (opcional): Filtro por dirección
- `minPrice` (opcional): Precio mínimo
- `maxPrice` (opcional): Precio máximo
- `page` (default: 1): Número de página
- `pageSize` (default: 10): Elementos por página

**Respuesta:**
```json
{
  "totalCount": 25,
  "page": 1,
  "pageSize": 10,
  "totalPages": 3,
  "data": [
    {
      "idProperty": "30877432d1026706d7e805da",
      "name": "Loft Urbano El Encanto",
      "address": "Cll 20 # 28-44, Barranquilla",
      "price": 1250000000,
      "codeInternal": "PROP100",
      "year": 2011,
      "owner": {
        "idOwner": "67200003f1a2c1a7b8000003",
        "name": "María González",
        "address": "Cll 15 # 25-30, Barranquilla",
        "photo": "maria_gonzalez.jpg",
        "birthday": "1985-03-15T00:00:00Z"
      },
      "images": [...],
      "traces": [...]
    }
  ]
}
```

#### 2. Obtener Propiedad por ID
```http
GET /api/property/30877432d1026706d7e805da
```

**Respuesta:**
```json
{
  "idProperty": "30877432d1026706d7e805da",
  "name": "Loft Urbano El Encanto",
  "address": "Cll 20 # 28-44, Barranquilla",
  "price": 1250000000,
  "codeInternal": "PROP100",
  "year": 2011,
  "owner": {...},
  "images": [...],
  "traces": [...]
}
```

#### 3. Health Check
```http
GET /ping
```

**Respuesta:**
```json
{
  "ok": true,
  "time": "2024-01-15T10:30:00Z"
}
```

## Pruebas

### Ejecutar Pruebas Unitarias
```bash
dotnet test Backend.Tests
```

### Pruebas Disponibles
- `PropertyServiceTests.GetProperties_ReturnsProperties()` - Verifica que el servicio retorna propiedades

## Desarrollo

### Estructura de Archivos Clave

```
Backend.API/
├── Program.cs                    # Configuración de servicios y middleware
├── Controllers/
│   └── PropertyController.cs     # Controlador principal
└── appsettings.json              # Configuración de MongoDB

Backend.Application/
├── Services/
│   └── PropertyService.cs        # Lógica de negocio
├── Interfaces/
│   └── IPropertyService.cs       # Contrato del servicio
└── Dtos/
    └── Dtos.cs                   # Objetos de transferencia

Backend.Domain/
└── Entities/
    └── Entities.cs               # Entidades del dominio

Backend.Infrastructure/
└── Repositories/
    ├── PropertyRepository.cs     # Acceso a datos Properties
    ├── OwnerRepository.cs        # Acceso a datos Owners
    ├── PropertyImageRepository.cs # Acceso a datos Images
    └── PropertyTraceRepository.cs # Acceso a datos Traces
```
**Desarrollado por Klein Brun**





