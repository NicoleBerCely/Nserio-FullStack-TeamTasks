using Dto;

namespace Dal
{
    public interface IApiDal
    {
        List<ProjectsDto> getProjects();
        List<ProjectsTaskDto> GetProjectsTask(int id, string? status, int? assigneeId, int page, int pageSize);
        List<DeveloperWorkloadDto> GetProjectsWorkload();
        List<ProjectHealthDto> GetProjectHealth();
        List<DeveloperDelayRiskDtocs> GetDeveloperDelayRisk();
        List<DevelopersDto> GetDevelopers();

        void CrearTasks(OTasksDto tasks);
        void ActualizarTasks(TaskDto tasks);
    }
    public class ApiDal:Dapper, IApiDal
    {
        public ApiDal(string ConexionString)
        {
            Conexion = ConexionString;
        }
        /// <summary>
        /// ver proyectos completos
        /// </summary>
        /// <returns></returns>
        public List<ProjectsDto> getProjects()
        {
            return ListQuery<ProjectsDto>("[ProjectManagement].[GetAllProjects]");
        }
        /// <summary>
        /// ver proyectos por id
        /// </summary>
        /// <param name="id"></param>
        /// <param name="status"></param>
        /// <param name="assigneeId"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        public List<ProjectsTaskDto> GetProjectsTask(int id, string? status, int? assigneeId, int page, int pageSize)
        {
            var parameters = new
            {
                Id = id,
                Status = status,
                AssigneeId = assigneeId,
                Page = page,
                PageSize = pageSize
            };

            return ListQuery<object, ProjectsTaskDto>("[ProjectManagement].[usp_GetTasksByProject]", parameters);
        }
        /// <summary>
        /// ver proyectos carga de trabajo
        /// </summary>
        /// <returns></returns>
        public List<DeveloperWorkloadDto> GetProjectsWorkload()
        {
            return ListQuery<DeveloperWorkloadDto>("[ProjectManagement].[GetDeveloperWorkload]");
        }
        /// <summary>
        /// Obtener estado del proyecto
        /// </summary>
        /// <returns></returns>
        public List<ProjectHealthDto> GetProjectHealth()
        {
            return ListQuery<ProjectHealthDto>("[ProjectManagement].[GetProjectHealth]");
        }
        /// <summary>
        /// Obtener Riesgo de retraso del desarrollador
        /// </summary>
        /// <returns></returns>
        public List<DeveloperDelayRiskDtocs> GetDeveloperDelayRisk()
        {
            return ListQuery<DeveloperDelayRiskDtocs>("[ProjectManagement].[sp_PredictDeveloperDelay]");
        }
        /// <summary>
        /// Obtener Desarrolladores
        /// </summary>
        /// <returns></returns>
        public List<DevelopersDto> GetDevelopers()
        {
            return ListQuery<DevelopersDto>("[ProjectManagement].[GetAlldevelopers]");
        }
        /// <summary>
        /// crear tareas
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns></returns>
        /// <exception cref="NotImplementedException"></exception>
        public void CrearTasks(OTasksDto tasks)
        {
            ExecuteQuery<OTasksDto>("[ProjectManagement].[usp_InsertTask]", tasks);
        }
        /// <summary>
        /// Actualizar tareas
        /// </summary>
        /// <param name="tasks"></param>
        public void ActualizarTasks(TaskDto tasks)
        {
            ExecuteQuery<TaskDto>("[ProjectManagement].[UpdateTaskStatus]", tasks);
        }
    }
}
