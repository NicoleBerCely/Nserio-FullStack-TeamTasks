/* =============================================
   DBSetup_TeamTasks.sql
   Crea la base de datos TeamTasksSample
============================================= */

IF DB_ID('TeamTasksSample') IS NOT NULL
BEGIN
    DROP DATABASE TeamTasksSample;
END
GO

CREATE DATABASE TeamTasksSample;
GO

USE TeamTasksSample;
GO

CREATE SCHEMA ProjectManagement;
GO

/* =============================================
   Tablas (DDL)
============================================= */

CREATE TABLE ProjectManagement.Developers (
    DeveloperId INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ProjectManagement.Projects (
    ProjectId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    ClientName NVARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(20) CHECK (Status IN ('Planned', 'InProgress', 'Completed'))
);

CREATE TABLE ProjectManagement.Tasks (
    TaskId INT PRIMARY KEY IDENTITY(1,1),
    ProjectId INT FOREIGN KEY REFERENCES ProjectManagement.Projects(ProjectId),
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    AssigneeId INT FOREIGN KEY REFERENCES ProjectManagement.Developers(DeveloperId),
    Status NVARCHAR(20) NOT NULL CHECK (Status IN ('ToDo', 'InProgress', 'Blocked', 'Completed')),
    Priority NVARCHAR(10) NOT NULL CHECK (Priority IN ('Low', 'Medium', 'High')),
    EstimatedComplexity INT NOT NULL CHECK (EstimatedComplexity BETWEEN 1 AND 5),
    DueDate DATE, -- Corregido: antes decía ueDate
    CompletionDate DATE,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

/* =============================================
   Insertar Datos (DML)
============================================= */

INSERT INTO ProjectManagement.Developers (FirstName, LastName, Email, IsActive) VALUES
('Ana', 'García', 'ana.garcia@email.com', 1),    
('Julian', 'Cely', 'julian@gmail.com', 1),      
('Lucia', 'Vargas', 'lucia.vargas@gmail.com', 1),
('David', 'Perez', 'david.perez@gmail.com', 1),  
('Sofia', 'Ramirez', 'sramirez@gmail.com', 1);   

INSERT INTO ProjectManagement.Projects (Name, ClientName, StartDate, Status) VALUES
('Sistema Contable', 'Finanzas S.A.', '2025-12-01', 'InProgress'),
('App Móvil Delivery', 'FastFood', '2026-01-10', 'InProgress'),
('Portal Educativo', 'UniMundo', '2026-02-01', 'Planned');

-- Tareas Completadas (Historial)
INSERT INTO ProjectManagement.Tasks 
(ProjectId, Title, Description, AssigneeId, Status, Priority, EstimatedComplexity, DueDate, CompletionDate)
VALUES
-- Proyecto 1: Sistema Contable (En Progreso)
(1, 'Diseño de Base de Datos', 'Crear esquema de tablas contables', 1, 'Completed', 'High', 5, '2025-12-10', '2025-12-12'), -- Retraso de 2 días
(1, 'Login de Usuario', 'Implementar JWT y roles', 2, 'Completed', 'Medium', 3, '2025-12-15', '2025-12-14'), -- A tiempo
(1, 'Generación de Facturas PDF', 'Librería iTextSharp', 1, 'InProgress', 'High', 4, DATEADD(day, 2, GETDATE()), NULL), -- Próxima a vencer
(1, 'Reporte de Balance General', 'Query complejo de saldos', 3, 'ToDo', 'High', 5, DATEADD(day, 10, GETDATE()), NULL),
(1, 'Integración Bancaria', 'API de pagos externos', 4, 'Blocked', 'High', 5, DATEADD(day, 15, GETDATE()), NULL),
(1, 'Corrección de Bug de Redondeo', 'Fix en decimales de IVA', 1, 'Completed', 'Low', 2, '2026-01-05', '2026-01-10'), -- Retraso de 5 días

-- Proyecto 2: App Móvil Delivery (En Progreso)
(2, 'Setup de Flutter', 'Configuración de entorno inicial', 5, 'Completed', 'Low', 1, '2026-01-15', '2026-01-15'),
(2, 'Integración Google Maps', 'Rutas de repartidores', 2, 'InProgress', 'High', 4, DATEADD(day, 3, GETDATE()), NULL), 
(2, 'Carrito de Compras', 'Lógica de persistencia local', 3, 'InProgress', 'Medium', 3, DATEADD(day, 8, GETDATE()), NULL),
(2, 'Notificaciones Push', 'Firebase Cloud Messaging', 5, 'ToDo', 'Medium', 3, DATEADD(day, 12, GETDATE()), NULL),
(2, 'Perfil de Usuario', 'Edición de datos y fotos', 4, 'Completed', 'Low', 2, '2026-02-01', '2026-02-01'),
(2, 'Pasarela de Pagos', 'Stripe integration', 2, 'InProgress', 'High', 5, DATEADD(day, 20, GETDATE()), NULL),
(2, 'Historial de Pedidos', 'Listado con filtros', 5, 'ToDo', 'Low', 2, DATEADD(day, 25, GETDATE()), NULL),

-- Proyecto 3: Portal Educativo (Planeado)
(3, 'Definición de Requerimientos', 'Reunión con stakeholders', 3, 'Completed', 'Medium', 2, '2026-02-05', '2026-02-05'),
(3, 'Maquetación UI/UX', 'Figma a HTML/CSS', 1, 'ToDo', 'Medium', 3, DATEADD(day, 15, GETDATE()), NULL),
(3, 'Módulo de Cursos', 'CRUD de lecciones', 2, 'ToDo', 'High', 4, DATEADD(day, 30, GETDATE()), NULL),
(3, 'Sistema de Exámenes', 'Lógica de calificación automática', 4, 'ToDo', 'High', 5, DATEADD(day, 45, GETDATE()), NULL),
(3, 'Foro de Discusión', 'Threads y respuestas', 5, 'ToDo', 'Medium', 3, DATEADD(day, 50, GETDATE()), NULL),
(3, 'Gestión de Certificados', 'Generación automática al terminar', 1, 'ToDo', 'Low', 2, DATEADD(day, 60, GETDATE()), NULL),
(3, 'Panel de Administrador', 'Gestión de usuarios y métricas', 3, 'ToDo', 'High', 4, DATEADD(day, 40, GETDATE()), NULL);
GO
/* =============================================
   Procedimientos Almacenados
============================================= */

-- 2.2.1 Carga por desarrollador
CREATE OR ALTER PROCEDURE [ProjectManagement].[GetDeveloperWorkload]
AS
BEGIN
    SELECT 
        CONCAT(d.FirstName, ' ', d.LastName) AS DeveloperName,
        COUNT(t.TaskId) AS OpenTasksCount,
        AVG(CAST(t.EstimatedComplexity AS FLOAT)) AS AverageEstimatedComplexity
    FROM ProjectManagement.Developers d
    LEFT JOIN ProjectManagement.Tasks t ON d.DeveloperId = t.AssigneeId AND t.Status <> 'Completed'
    WHERE d.IsActive = 1
    GROUP BY d.DeveloperId, d.FirstName, d.LastName;
END;
GO

-- 2.2.2 Estado por proyecto
CREATE OR ALTER PROCEDURE [ProjectManagement].[GetProjectHealth]
AS
BEGIN
    SELECT p.ProjectId,
           p.Name as ProjectName,
           p.ClientName,
           COUNT(t.TaskId) as TotalTasks,
           SUM(CASE WHEN T.Status <> 'Completed' THEN 1 ELSE 0 END ) AS OpenTasks,
           SUM(CASE WHEN T.Status = 'Completed' THEN 1 ELSE 0 END ) AS CompletedTasks
    FROM ProjectManagement.Projects p
    LEFT JOIN ProjectManagement.Tasks t ON p.ProjectId = t.ProjectId
    GROUP BY p.ProjectId, p.Name, p.ClientName
    ORDER BY ProjectId;
END;
GO
-- 2.2.3 Tareas próximas a vencer 
CREATE OR ALTER PROCEDURE [ProjectManagement].[GetUpcomingDeadlines]
AS
BEGIN
    SELECT Title, DueDate, Status, Priority
    FROM ProjectManagement.Tasks
    WHERE Status <> 'Completed'
      AND DueDate BETWEEN GETDATE() AND DATEADD(DAY, 7, GETDATE());
END;
GO

-- 2.3 Predicción de Riesgo
CREATE OR ALTER PROCEDURE [ProjectManagement].[sp_PredictDeveloperDelay]
AS
BEGIN
    SET NOCOUNT ON;
    WITH CompletedStats AS (
        SELECT AssigneeId,
               AVG(CAST(CASE WHEN CompletionDate > DueDate THEN DATEDIFF(DAY, DueDate, CompletionDate) ELSE 0 END AS FLOAT)) AS AvgDelayDays
        FROM ProjectManagement.Tasks
        WHERE Status = 'Completed' AND CompletionDate IS NOT NULL
        GROUP BY AssigneeId
    ),
    OpenStats AS (
        SELECT AssigneeId,
               COUNT(*) AS OpenTasksCount,
               MIN(DueDate) AS NearestDueDate, 
               MAX(DueDate) AS LatestDueDate
        FROM ProjectManagement.Tasks
        WHERE Status <> 'Completed'
        GROUP BY AssigneeId
    )
    SELECT d.FirstName + ' ' + d.LastName AS DeveloperName,
           ISNULL(o.OpenTasksCount, 0) AS OpenTasksCount,
           ISNULL(ROUND(c.AvgDelayDays, 2), 0) AS AvgDelayDays,
           o.NearestDueDate,
           o.LatestDueDate,
           DATEADD(DAY, CAST(ISNULL(c.AvgDelayDays, 0) AS INT), o.LatestDueDate) AS PredictedCompletionDate,
           CASE WHEN DATEADD(DAY, CAST(ISNULL(c.AvgDelayDays, 0) AS INT), o.LatestDueDate) > o.LatestDueDate 
                OR ISNULL(c.AvgDelayDays, 0) >= 3 THEN 1 ELSE 0 END AS HighRiskFlag
    FROM ProjectManagement.Developers d
    LEFT JOIN CompletedStats c ON d.DeveloperId = c.AssigneeId
    LEFT JOIN OpenStats o ON d.DeveloperId = o.AssigneeId
    WHERE d.IsActive = 1;
END;
GO
--proyectos/{id}/tareas
CREATE OR ALTER PROCEDURE ProjectManagement.usp_GetTasksByProject
    @Id INT,
    @Status VARCHAR(50) = NULL,      -- Filtro: status
    @AssigneeId INT = NULL,          -- Filtro: assigneeId
    @Page INT = 1,                   -- Paginación: nro página
    @PageSize INT = 100               -- Paginación: tamaño
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.TaskId,
        t.ProjectId,
        t.Title,
        t.Description,
        t.Status,
        t.Priority,
        t.EstimatedComplexity,
        t.DueDate,
        t.CompletionDate,
        t.AssigneeId,
        u.FirstName,                 -- Obtenido del JOIN con Usuarios
        u.LastName,                  -- Obtenido del JOIN con Usuarios
        t.CreatedAt
    FROM ProjectManagement.Tasks t
    LEFT JOIN ProjectManagement.Developers u ON t.AssigneeId = u.DeveloperId
    WHERE t.ProjectId = @Id
      AND (@Status IS NULL OR t.Status = @Status)
      AND (@AssigneeId IS NULL OR t.AssigneeId = @AssigneeId)
    
    ORDER BY t.CreatedAt DESC        -- Ordenar por lo más reciente
    
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO
--Ver desarrolladores
CREATE   PROCEDURE [ProjectManagement].[GetAlldevelopers]
AS
BEGIN
    SELECT 
		DeveloperId,
        CONCAT(FirstName, ' ', LastName) AS FullName,
		Email
        FROM ProjectManagement.Developers 
END;
GO

---Crear tarea
CREATE OR ALTER PROCEDURE ProjectManagement.usp_InsertTask
     @ProjectId INT,
    @Title NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
	@AssigneeId INT = NULL,
    @Status VARCHAR(50) = NULL,    
    @Priority VARCHAR(50) = NULL, 
    @EstimatedComplexity INT = 0,
    @DueDate DATETIME = NULL

AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
	-- 1. VALIDACIÓN: Campos requeridos (No nulos o vacíos)
        IF ISNULL(@Title, '') = ''
        BEGIN
            RAISERROR('El título de la tarea es obligatorio.', 16, 1);
            RETURN;
        END

        -- 2. VALIDACIÓN: ID de Proyecto válido
        IF NOT EXISTS (SELECT 1 FROM ProjectManagement.Projects WHERE ProjectId = @ProjectId)
        BEGIN
            RAISERROR('El ProjectId proporcionado no existe.', 16, 1);
            RETURN;
        END

        -- 3. VALIDACIÓN: ID de Asignado válido (si se proporciona)
        IF @AssigneeId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ProjectManagement.Developers WHERE DeveloperId = @AssigneeId)
        BEGIN
            RAISERROR('El DeveloperId (AssigneeId) proporcionado no existe.', 16, 1);
            RETURN;
        END

        -- 4. REGLA DE NEGOCIO: Fecha de entrega no puede ser en el pasado
        IF @DueDate IS NOT NULL AND @DueDate < CAST(GETDATE() AS DATE)
        BEGIN
            RAISERROR('La fecha de entrega (DueDate) no puede ser anterior a la fecha actual.', 16, 1);
            RETURN;
        END
		-- VALIDACIÓN: Evitar tareas duplicadas
		IF EXISTS (
		    SELECT 1 FROM ProjectManagement.Tasks 
		    WHERE ProjectId = @ProjectId 
		      AND Title = @Title 
		      AND AssigneeId = @AssigneeId
		)
		BEGIN
		    RAISERROR('Esta tarea ya se encuentra asignada a este desarrollador en este proyecto.', 16, 1);
		    RETURN;
		END
        INSERT INTO ProjectManagement.Tasks (
            ProjectId,
            Title,
            Description,
            Status,
            Priority,
            EstimatedComplexity,
            DueDate,
            AssigneeId,
            CreatedAt
        )
        VALUES (
            @ProjectId,
            @Title,
            @Description,
            @Status,
            @Priority,
            @EstimatedComplexity,
            @DueDate,
            @AssigneeId,
            GETDATE()
        );

        -- Retornamos el ID recién creado para que la API sepa cuál es
        SELECT SCOPE_IDENTITY() AS NewTaskId;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
-- actualizar tarea
CREATE OR ALTER PROCEDURE [ProjectManagement].[UpdateTaskStatus]
    @TaskId INT,
    @Status VARCHAR(50) = NULL,             
    @Priority VARCHAR(50) = NULL,           
    @EstimatedComplexity INT = NULL         
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- 1. VALIDACIÓN: ¿Existe la tarea?
        IF NOT EXISTS (SELECT 1 FROM ProjectManagement.Tasks WHERE TaskId = @TaskId)
        BEGIN
            RAISERROR('La tarea con el ID proporcionado no existe.', 16, 1);
            RETURN;
        END
        UPDATE ProjectManagement.Tasks
        SET 
            Status = COALESCE(@Status, Status),
            Priority = COALESCE(@Priority, Priority),
            EstimatedComplexity = COALESCE(@EstimatedComplexity, EstimatedComplexity),
            CompletionDate = CASE 
                                WHEN @Status = 'Completed' THEN GETDATE() 
                                ELSE CompletionDate 
                             END
        WHERE TaskId = @TaskId;
        SELECT * FROM ProjectManagement.Tasks WHERE TaskId = @TaskId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
-- ver Proyectos
CREATE OR ALTER PROCEDURE [ProjectManagement].[GetAllProjects]
AS
BEGIN
    SELECT 
		p.ProjectId,
		p.Name,
		p.ClientName,
		p.Status,
        COUNT(t.TaskId) as TotalTasks,
		SUM(CASE WHEN t.Status <> 'Completed' THEN 1 ELSE 0 END ) AS OpenTasks,
		SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END ) AS CompletedTasks
        FROM ProjectManagement.Projects p
		LEFT JOIN ProjectManagement.Tasks t ON p.ProjectId = t.ProjectId
		GROUP BY p.ProjectId,p.Name,p.ClientName,p.Status
END;
GO