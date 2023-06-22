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

        public int Register(RegisterVM registerVM)
        {
           
            Account account = new Account
            {
                AccountId = registerVM.AccountId,
                Email = registerVM.Email,
                Password = registerVM.Password,
                Nickname = registerVM.Nickname,
                Fullname = registerVM.Fullname,
                Birthplace = registerVM.Birthplace,
                Birthdate = registerVM.Birthdate,
                Religion = registerVM.Religion,
               Gender = registerVM.Gender,
               Maritalstatus = registerVM.Maritalstatus,
               Hiredstatus = registerVM.Hiredstatus,    
               Nationality = registerVM .Nationality,
               Phone= registerVM .Phone,    
               Address= registerVM .Address,     
               Image= registerVM.Image,
               RoleId= registerVM .RoleId,  

            };
            _context.Entry(account).State = EntityState.Added;

           

            // myContext.Entry(employee).State = EntityState.Added;
            var save = _context.SaveChanges();
            return save;
        }

    }
    

}
