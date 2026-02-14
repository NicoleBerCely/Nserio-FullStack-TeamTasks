using Bussiness;
using Dto;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendNSerio.Controllers
{
    [Route("/api/projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApiBussiness _bussiness;

        /// <summary>
        /// El constructor recibe el Business ya configurado desde Program.cs
        /// </summary>
        /// <param name="bussiness"></param>
        public ProjectsController(ApiBussiness bussiness)
        {
            _bussiness = bussiness;
        }

        /// <summary>
        /// ver proyectos completos
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult getProjects()
        {
            try
            {
                List<ProjectsDto> projects = _bussiness.getProjects();
                
                return Ok(new { success = true, content = projects });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
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
        [HttpGet]
        [Route("/api/projects/{id}/tasks")]
        public IActionResult GetProjectsTask(int id, string? status = null, int? assigneeId = null, int page = 1, int pageSize = 100)
        {
            try
            {
                var data = _bussiness.GetProjectsTask(id, status, assigneeId, page, pageSize);

                if (data != null)
                    return Ok(new { success = true, content = data });

                return NotFound(new { success = false, content = "No se encontraron tareas" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
    }
}
