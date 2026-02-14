using Bussiness;
using Dto;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendNSerio.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApiBussiness _bussiness;
        /// <summary>
        /// El constructor recibe el Business ya configurado desde Program.cs
        /// </summary>
        /// <param name="bussiness"></param>
        public DashboardController(ApiBussiness bussiness)
        {
            _bussiness = bussiness;
        }
        /// <summary>
        /// ver proyectos carga de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("developer-workload")]
        public IActionResult GetProjectsWorkload()
        {
            try
            {
                List<DeveloperWorkloadDto> projects = _bussiness.GetProjectsWorkload();

                return Ok(new { success = true, content = projects });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
        /// <summary>
        /// Obtener estado del proyecto
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("project-health")]
        public IActionResult GetProjectHealth()
        {
            try
            {
                List<ProjectHealthDto> projects = _bussiness.GetProjectHealth();

                return Ok(new { success = true, content = projects });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
        /// <summary>
        /// obtener Riesgo de retraso del desarrollador
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("developer-delay-risk")]
        public IActionResult GetDeveloperDelayRisk()
        {
            try
            {
                List<DeveloperDelayRiskDtocs> projects = _bussiness.GetDeveloperDelayRisk();

                return Ok(new { success = true, content = projects });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
    }
}
