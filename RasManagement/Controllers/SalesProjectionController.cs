using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Employee,Admin,Super_Admin,Sales,Manager,Trainer")]
    public class SalesProjectionController : BaseController<SalesProjection, SalesProjectionRepository,int>
    {

        private readonly SalesProjectionRepository salesProjectionRepository;
        public SalesProjectionController(SalesProjectionRepository salesProjectionRepository) : base(salesProjectionRepository)
        {
            this.salesProjectionRepository = salesProjectionRepository; ;
        }
    }
}
