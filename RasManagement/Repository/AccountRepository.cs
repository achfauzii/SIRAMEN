using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class AccountRepository : GenericRepository<Account>, IAccount
    {
        private readonly ProjectRasmanagementContext _context;

        public AccountRepository(ProjectRasmanagementContext context) : base(context)
        {
            _context = context;
        }
        public Account GetByView(VMLogin viewLogin)
        {

            var myAcc = _context.Accounts.SingleOrDefault(a => a.Email == viewLogin.Email);

            if (myAcc != null)
            {
                //var myPass = BCrypt.Net.BCrypt.Verify(viewLogin.Password, myAcc.Password);
                var myPass = viewLogin.Password == myAcc.Password;
                if (myPass != false)
                {
                    return myAcc;
                }
                return CheckValidation.PasswordNotPassed;
            }
            return CheckValidation.NullPointerAnAccount;
        }

    }
    

}
