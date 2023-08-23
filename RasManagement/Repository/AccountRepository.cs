using Microsoft.EntityFrameworkCore;
//using Microsoft.Identity.Client;
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

        //Generate Account Id
        public async Task<string> GenerateId()
        {
            var currentDate = DateTime.Now.ToString("ddMMyyy");
            int countAccount = _context.Accounts.Count();
            /* var lastEmployee = myContext.Employees
                 .OrderByDescending(e => e.NIK)
                 .FirstOrDefault();*/
            var ras = "RAS";
            if (countAccount == 0)
            {
                // Jika belum ada data sama sekali, maka ID dimulai dari 0
                return DateTime.Now.ToString("ddMMyyyy") + "000";
            }

            return $"{ras}{currentDate}{countAccount.ToString("D3")}";


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



        public Account GetById(VMLogin viewLogin)
        {

            var myAcc = _context.Accounts.SingleOrDefault(a => a.Email == viewLogin.Email);

            if (myAcc != null)
            {
                return myAcc;
            }
            return CheckValidation.NullPointerAnAccount;
        }

        public async Task<bool> AccountIsExist(string email, string accountId)
        {

            var emailIsExist = _context.Accounts.SingleOrDefault(a => a.Email == email);
            var accountIdIsExist = _context.Accounts.SingleOrDefault(a => a.AccountId == accountId);

            if (accountIdIsExist != null)
            {

                return true;
            }
            else if (emailIsExist != null)
            {

                return true;
            }
            return false;
        }


        public async Task<int> Register(RegisterVM registerVM)
        {
            var generateId = await GenerateId();
            Account account = new Account
            {
                /* AccountId = registerVM.AccountId,
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
                RoleId= registerVM .RoleId,  */

                AccountId = generateId,
                Email = registerVM.Email,
                Password = registerVM.Password,
                Fullname = registerVM.Fullname,
                Gender = registerVM.Gender,
                Hiredstatus = registerVM.Hiredstatus,
                RoleId = registerVM.RoleId,

            };
            _context.Entry(account).State = EntityState.Added;



            // myContext.Entry(employee).State = EntityState.Added;
            var save = _context.SaveChanges();
            return save;
        }


        public const int successful = 1;
        public const int notfound = 2;
        public const int emailNotFound = 3;
        public const int wrongPassword = 4;

        public int FindbyEmail(string email)
        {
            var myAcc = _context.Accounts.SingleOrDefault(a => a.Email == email);
            if (myAcc == null)
            {
                return emailNotFound;
            }
            else if (myAcc != null)
            {
                return successful;
            }
            else
            {
                return 500;
            }
        }

        public async Task<List<Account>> GetByEmail(string email)
        {
            var account = await _context.Accounts
                .Where(e => e.Email == email)
                .ToListAsync();

            return account;
        }
        public int Login(VMLogin viewLogin)
        {
            var myAcc = _context.Accounts.SingleOrDefault(a => a.Email == viewLogin.Email);

            if (myAcc == null)
            {
                return emailNotFound;
            }
            else
            {
                var myPass = viewLogin.Password == myAcc.Password;
                if (myPass)
                {
                    return successful;
                }
                else
                {
                    return wrongPassword;
                }
            }
        }





        //FORGOT PASSWORD UPDATE
        public async Task<bool> UpdateForgotPassword(UpdatePasswordVM updatePassword)
        {
            var account = await _context.Accounts.SingleOrDefaultAsync(a => a.Email == updatePassword.Email);
            if (account != null)
            {
                account.Password = updatePassword.NewPassword;
                _context.Accounts.Update(account);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }


        public async Task<int> UpdateRole(RoleVM roleVM)
        {
            var account = await _context.Accounts.FindAsync(roleVM.AccountId);

            if (account != null)
            {
                // Update nilai RoleId pada entitas Account
                account.RoleId = roleVM.RoleId;
                

                _context.Accounts.Update(account);

                // Simpan perubahan ke database
                try
                {
                    return await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    // Tangani kesalahan jika diperlukan
                    Console.WriteLine($"Error updating data: {ex.Message}");
                    return 0; // Atau return -1 atau kode yang sesuai untuk menandakan kesalahan
                }
            }
            else
            {
                // Tidak ditemukan akun dengan AccountId yang sesuai
                return 0; // Atau kode lain yang sesuai
            }

            /*var account = new Account
            {
                AccountId = roleVM.AccountId,
                RoleId = roleVM.RoleId,
            };

            _context.Accounts.Update(account);
            return await _context.SaveChangesAsync();

                /*_context.Entry(account).State = EntityState.Modified;
                return _context.SaveChanges();*/

        }

        public Account GetAccountId(string accountId)
        {
            return _context.Accounts.Find(accountId);
        }
    }


}
