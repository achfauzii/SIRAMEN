
using Microsoft.AspNetCore.Mvc;


namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ProjectRasmanagementContext _context;

        public AccountsController(ProjectRasmanagementContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Account>>> GetAccounts()
        {
            return Ok(await _context.Accounts.ToListAsync());
        }
    }
}
