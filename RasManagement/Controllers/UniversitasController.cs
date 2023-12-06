using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;
using System.Net;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Employee,Admin,Super_Admin")]
    public class UniversitasController : BaseController<DataUniversita, UniversitasRepository, int>
    {
        private readonly UniversitasRepository universitasRepository;
        public UniversitasController(UniversitasRepository universitasRepository) : base(universitasRepository)
        {
            this.universitasRepository = universitasRepository;
        }
    }
}
