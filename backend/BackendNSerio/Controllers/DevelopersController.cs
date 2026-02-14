using Bussiness;
using Dto;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendNSerio.Controllers
{
    [Route("api/developers")]
    [ApiController]
    public class DevelopersController : ControllerBase
    {
        private readonly ApiBussiness _bussiness;
        /// <summary>
        /// El constructor recibe el Business ya configurado desde Program.cs
        /// </summary>
        /// <param name="bussiness"></param>
        public DevelopersController(ApiBussiness bussiness)
        {
            _bussiness = bussiness;
        }
        /// <summary>
        /// obtener Desarrolladores
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetDevelopers()
        {
            try
            {
                List<DevelopersDto> developers = _bussiness.GetDevelopers();

                return Ok(new { success = true, content = developers });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, content = e.Message });
            }
        }
    }
}
