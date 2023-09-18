using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class TurnOverController : BaseController<TurnOver, TurnOverRepository, int>
    {
        private readonly TurnOverRepository turnOverRepository;
        public TurnOverController(TurnOverRepository turnOverRepository) : base(turnOverRepository)
        {
            this.turnOverRepository = turnOverRepository;
        }
    }

}
