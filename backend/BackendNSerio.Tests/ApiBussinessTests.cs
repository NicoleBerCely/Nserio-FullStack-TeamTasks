using Moq;   
using Xunit; 
using Bussiness;
using Dal;
using Dto;

namespace BackendNSerio.Tests
{
    public class ApiBussinessTests
    {
        [Fact]
        public void CrearTasks_RetornaMensajeExitoso()
        {
            // 1. Arrange
            var mockDal = new Mock<IApiDal>(); 

            // Pasamos el mockDal.Object (que es la instancia falsa)
            var business = new ApiBussiness(mockDal.Object);

            var miTarea = new OTasksDto();

            // 2. Act
            var resultado = business.CrearTasks(miTarea);

            // 3. Assert
            Assert.Equal("La tarea fue creada con éxito", resultado);

            // Verifica que el método del DAL se llamó exactamente 1 vez
            mockDal.Verify(d => d.CrearTasks(It.IsAny<OTasksDto>()), Times.Once());
        }
    }
}