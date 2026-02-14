using Dal;
using Dto;
using System.Collections.Generic;

namespace Bussiness
{
    public class ApiBussiness
    {
        private readonly IApiDal _dal;

        /// <summary>
        /// Constructor principal para Inyección de Dependencias Testing
        /// </summary>
        public ApiBussiness(IApiDal dal)
        {
            _dal = dal;
        }
        /// <summary>
        /// Constructor secundario para compatibilidad con cadena de conexión directa
        /// </summary>
        public ApiBussiness(string _conexion)
        {
            _dal = new ApiDal(_conexion);
        }
        /// <summary>
        /// ver proyectos completos
        /// </summary>
        /// <returns></returns>
        public List<ProjectsDto> getProjects()
        {
            return _dal.getProjects();
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
        public IEnumerable<ProjectsTaskDto> GetProjectsTask(int id, string? status, int? assigneeId, int page, int pageSize)
        {
            return _dal.GetProjectsTask(id, status, assigneeId, page, pageSize);
        }
        /// <summary>
        /// ver proyectos carga de trabajo
        /// </summary>
        /// <returns></returns>
        public List<DeveloperWorkloadDto> GetProjectsWorkload()
        {
            return _dal.GetProjectsWorkload();
        }
        /// <summary>
        /// Obtener estado del proyecto
        /// </summary>
        /// <returns></returns>
        public List<ProjectHealthDto> GetProjectHealth()
        {
            return _dal.GetProjectHealth();
        }
        /// <summary>
        /// Obtener Riesgo de retraso del desarrollador
        /// </summary>
        /// <returns></returns>
        public List<DeveloperDelayRiskDtocs> GetDeveloperDelayRisk()
        {
            return _dal.GetDeveloperDelayRisk();
        }
        /// <summary>
        /// Obtener Desarrolladores
        /// </summary>
        /// <returns></returns>
        public List<DevelopersDto> GetDevelopers()
        {
            return _dal.GetDevelopers();
        }

        /// <summary>
        /// Crea una nueva tarea validando los datos de entrada
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns></returns>
        public string CrearTasks(OTasksDto tasks)
        {
            
            if (tasks == null)
            {
                return "Error: Los datos de la tarea son obligatorios.";
            }
            _dal.CrearTasks(tasks);
            return "La tarea fue creada con éxito";

        }
        /// <summary>
        /// Actualizar tareas
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns></returns>
        public string ActualizarTasks(TaskDto tasks)
        {
            if (tasks == null) return "Error: Datos inválidos.";

            _dal.ActualizarTasks(tasks);
            return "Tarea actualizada con éxito";
        }
    }
}