using Bussiness;
using Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace BackendNSerio.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ApiBussiness _bussiness;

        public TasksController(ApiBussiness bussiness)
        {
            _bussiness = bussiness;
        }

        /// <summary>
        /// Crea una nueva tarea validando los datos de entrada
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult CrearTasks([FromBody] OTasksDto tasks)
        {
            try
            {
                if (tasks == null) return BadRequest(new { success = false, content = "Datos de tarea no proporcionados." });

                var resultado = _bussiness.CrearTasks(tasks);
                return Ok(new { success = true, content = resultado });
            }
            catch (SqlException ex)
            {
                return BadRequest(new { success = false, content = "Error de base de datos: " + ex.Message });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = "Ocurrió un error interno: " + e.Message });
            }
        }

        /// <summary>
        /// Actualizar tareas
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns></returns>
        [HttpPut]
        public IActionResult ActualizarTasks([FromBody] TaskDto tasks)
        {
            try
            {
                var resultado = _bussiness.ActualizarTasks(tasks);
                return Ok(new { success = true, content = resultado });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
    }
}