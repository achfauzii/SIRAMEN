using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrackingController : BaseController<TrackingInterview, TrackingRepository, int>
    {
        private readonly TrackingRepository trackingRepository;
        public TrackingController(TrackingRepository trackingRepository) : base(trackingRepository)
        {
            this.trackingRepository = trackingRepository;
        }
    }
}
