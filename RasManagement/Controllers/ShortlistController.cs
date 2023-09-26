using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RasManagement.BaseController;
using RasManagement.Repository;

namespace RasManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShortlistController : BaseController<NonRasCandidate, ShortlistRepository, int>
    {
        private readonly ShortlistRepository shortlistRepository;
        public ShortlistController(ShortlistRepository shortlistRepository) : base(shortlistRepository)
        {
            this.shortlistRepository = shortlistRepository;
        }
       /* [HttpPost("CreateOrUpdateEmployee")]
        public IActionResult CreateOrUpdateEmployee([FromBody] EmployeeModel employee)
        {
            try
            {
                if (employee.AccountId == "")
                {
                    // Ini adalah operasi penambahan, karena EmployeeId baru.
                    // Ini adalah operasi penambahan, karena EmployeeId baru.
                    var account = new Account
                    {
                        AccountId = accountRepository.GetAccountId(),
                        Fullname = employee.FullName,
                        Email = employee.Email,
                        Nickname = employee.NickName,

                    };
                    _context.Accounts.Add(account);
                }
                else
                {
                    // Ini adalah operasi pembaruan, karena EmployeeId sudah ada.
                    //_context.Accounts.Update(employee);
                }

                _context.SaveChanges();
                return Ok("Data berhasil disimpan");
            }
            catch (Exception ex)
            {
                return BadRequest($"Gagal menyimpan data: {ex.Message}");
            }
        }*/
    }
}
