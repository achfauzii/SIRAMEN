
using Microsoft.AspNetCore.Mvc;
using RasManagement.Repository;
using RasManagement.ViewModel;
using System.Net;
using System.Reflection;


namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {

        private readonly ProjectRasmanagementContext _context;
        private readonly AccountRepository accountRepository;
      

    
        public AccountsController(ProjectRasmanagementContext context, AccountRepository accountRepository)
        {
            _context = context;
            this.accountRepository = accountRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Account>>> GetAccounts()
        {
            return Ok(await _context.Accounts.ToListAsync());
        }

        [HttpPost("Register")]
        public ActionResult Reister(RegisterVM registerVM)
        {

            if (string.IsNullOrWhiteSpace(registerVM.Email))
            {
                return StatusCode(400, new { status = HttpStatusCode.BadRequest, message = "Data Kosong atau Mengandung Spasi", Data = registerVM });
            }
            accountRepository.Register(registerVM);
            return StatusCode(200, new { status = HttpStatusCode.OK, message = "Data Berhasil Di Tambahkan", Data = registerVM });
        }
    }
}
