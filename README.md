# Team Tasks Dashboard System 🚀

Este repositorio contiene la solución técnica integral para la gestión de proyectos y análisis de carga de trabajo. La solución incluye una base de datos SQL Server, una API en .NET 8 y una aplicación Web SPA moderna en React 19.

## 📦 Estructura del Repositorio
- **`DBSetup_TeamTasks.sql`**: Script `DBSetup_TeamTasks.sql` (Esquemas y datos iniciales).
- **`backend/`**: Solución API .NET 8 organizada por capas (`Bussiness`, `Dal`, `Dto`, `Web`).
- **`frontend/`**: Aplicación Web SPA desarrollada en **React 19+**.
- **`README.md`**: Documentación técnica e instrucciones.

---

## 🚀 Decisiones de Diseño y Arquitectura

### Backend (API)
- **Arquitectura por Capas**: Separación estricta de responsabilidades para facilitar el mantenimiento y escalabilidad.
- **Testing**: Pruebas unitarias implementadas con **xUnit** y **Moq** para asegurar la integridad de la lógica de negocio.
- **Acceso a Datos**: Uso de **Dapper** y Procedimientos Almacenados para un rendimiento óptimo.

### Frontend (SPA)
Se implementó una arquitectura basada en componentes funcionales y hooks modernos:
- **Gestión de Estado**: Uso estratégico de `useState` para datos locales, `useEffect` para ciclos de vida y `useMemo` para optimizar cálculos pesados de renderización.
- **Navegación y Flujo**:
  - **Dashboard Principal**: Vista consolidada con acceso directo a la creación de nuevas tareas mediante el botón **"New Task"**.
  - **Navegación Contextual**: Al interactuar con el "Estado de Proyecto", el sistema redirecciona dinámicamente a la vista detallada de tareas asignadas a dicho proyecto.
- **Stack Tecnológico**:
  - **TanStack Table**: Para tablas responsivas con filtrado y ordenamiento avanzado.
  - **shadcn/ui**: Componentes de alta calidad y accesibilidad.
  - **Axios**: Cliente HTTP para la conexión eficiente con la API de .NET.
  - **Tailwind CSS**: Diseño responsivo y estilizado.

---

## 💡 Supuestos y Lógica de Negocio
1. **Renderización Optimizada**: Se priorizó el uso de memorización para evitar re-renders innecesarios en las tablas de tareas y gráficos.
2. **Inyección de Dependencias**: El backend utiliza interfaces (`IApiDal`) para permitir un desacoplamiento total entre la lógica y la persistencia.
3. **Flujo de Usuario**: Se diseñó una experiencia de usuario donde el Dashboard actúa como centro de control, permitiendo saltar a detalles de proyectos específicos con un solo clic.

---

## 🛠️ Tecnologías y Versiones
- **Backend**: .NET 8.0, Dapper, xUnit, Moq.
- **Frontend**: React 19, Vite, TanStack Table, shadcn/ui, Axios, Recharts.
- **Base de Datos**: SQL Server 2022.

---

## ⚙️ Configuración e Instalación

### 1. Base de Datos
1. Ejecute el script `DBSetup_TeamTasks.sql` en SQL Server.

### 2. API Backend
1. Configure su cadena de conexión en `backend/Web/appsettings.json`
	```json
   	"ConnectionStrings": {
     		"DefaultConnection": "Server=SU_SERVIDOR;User Id=USUARIO;Password=CONTRASEÑA;Database=TeamTasksSample;TrustServerCertificate=true;"
   }
2. Ejecute `dotnet test` para validar las pruebas unitarias.
3. Inicie el proyecto desde Visual Studio o vía `dotnet run` O (F5).

### 3. Web SPA (Frontend)
1. Navegue a `frontend/`.
2. Abra terminal del proyecto e instale dependencias: `npm install`.
3. Inicie: `npm run dev`.

### 3. Repositorio
**El link**:https://github.com/NicoleBerCely/Nserio-FullStack-TeamTasks.
---
Realizado por Nicole Bermudez Cely