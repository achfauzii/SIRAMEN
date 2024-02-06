using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
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
            string currentDate = DateTime.Now.ToString("ddMMyy");
            string newNIK = "";
            var countAccount = _context.Accounts.Count();
            var lastAccount = _context.Accounts
                        .Where(acc => acc.AccountId.Contains("RAS" + currentDate))
                        .OrderByDescending(account => account.AccountId)
                        .FirstOrDefault();

            if (countAccount == null || countAccount == 0 || lastAccount==null)
            {
                newNIK = "RAS" + currentDate + "001";
            }
            else
            {
                string lastTwoDigits = lastAccount.AccountId.Substring(lastAccount.AccountId.Length - 3);
                int incrementedNumber = int.Parse(lastTwoDigits) + 1;
                newNIK = "RAS" + currentDate + incrementedNumber;
            }

            return newNIK;
        }

        public async Task<string> GenerateNonId()
        {
            //var currentDate = DateTime.Now.ToString("ddMMyyy");
            int countAccount = _context.Accounts.Count(account => account.RoleId == "5");
            /* var lastEmployee = myContext.Employees
                 .OrderByDescending(e => e.NIK)
                 .FirstOrDefault();*/
            var ras = "NonRAS";
            if (countAccount == 0)
            {
                // Jika belum ada data sama sekali, maka ID dimulai dari 0
                //return DateTime.Now.ToString("ddMMyyyy") + "000";
                return ras + "00";
            }
            return $"{ras}{countAccount.ToString("D3")}";
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


        public async Task<string> Register(RegisterVM registerVM)
        {
            var generateId = await GenerateId();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerVM.Password);
            Account account = new Account
            {
                AccountId = generateId,
                NIK = registerVM.NIK,
                Email = registerVM.Email,
                Password = passwordHash,
                Position = registerVM.Position,
                Fullname = registerVM.Fullname,
                Gender = registerVM.Gender,
                JoinDate = registerVM.JoinDate,
                Hiredstatus = registerVM.Hiredstatus,
                StartContract = registerVM.StartContract,
                EndContract = registerVM.EndContract,
                RoleId = registerVM.RoleId,
                IsChangePassword = false,
                Level = registerVM.Level,
                FinancialIndustry = registerVM.FinancialIndustry,
            };
            _context.Entry(account).State = EntityState.Added;

            // myContext.Entry(employee).State = EntityState.Added;
            _context.SaveChanges();
            return generateId;
        }


        public const int successful = 1;
        public const int notfound = 2;
        public const int emailNotFound = 3;
        public const int wrongPassword = 4;
        public const int suspend = 5;

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
            else if (myAcc.RoleId == "4")
            {
                return suspend;
            }
            else
            {
                var myPass = BCrypt.Net.BCrypt.Verify(viewLogin.Password, myAcc.Password);
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
        public async Task<bool> UpdatePassword(UpdatePasswordVM updatePassword)
        {
            var account = await _context.Accounts.SingleOrDefaultAsync(a => a.Email == updatePassword.Email);
            if (account != null)

            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(updatePassword.NewPassword);
                account.Password = passwordHash;

                _context.Accounts.Update(account);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> ChangePassword(ChangePassVM changePass)
        {
            var account = await _context.Accounts.SingleOrDefaultAsync(a => a.Email == changePass.Email);

            if (account != null && BCrypt.Net.BCrypt.Verify(changePass.CurrentPassword, account.Password))
            {
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(changePass.NewPassword);
                account.Password = passwordHash;
                account.IsChangePassword = true;
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

        }

        public async Task<int> UpdateNIK(NikVM nikVM)
        {
            var account = await _context.Accounts.FindAsync(nikVM.AccountId);

            if (account != null)
            {
                // Update nilai RoleId pada entitas Account
                account.NIK = nikVM.NIK;


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

        }

        public async Task<int> UpdateTurnOver(TurnOverVM turnOverVM)
        {
            var placement = new Placement
            {
                PlacementStatusId = turnOverVM.PlacementStatusId,
                PlacementStatus = turnOverVM.PlacementStatus,
                CompanyName = turnOverVM.CompanyName,
                Description = turnOverVM.Description,
                AccountId = turnOverVM.AccountId,

            };

            _context.Entry(placement).State = EntityState.Modified;
            return _context.SaveChanges();

            /*if (int.TryParse(turnOverVM.AccountId, out int accountId))
            {

                var turnover = await _context.Placements.FindAsync(turnOverVM.AccountId);

                if (turnover != null)
                {
                    // Update placement status
                    turnover.PlacementStatusId = turnOverVM.PlacementStatusId;
                    turnover.PlacementStatus = turnOverVM.PlacementStatus;

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

                    *//*//_context.Entry(turnover).State = EntityState.Modified;

                    _context.Placements.Update(placements);

                    return await _context.SaveChangesAsync();
                    // Simpan perubahan ke database*//*

                }
                else
                {
                    // Tidak ditemukan akun dengan AccountId yang sesuai
                    return 0; // Atau kode lain yang sesuai
                }
            }
            else
            {
                return 0;
            }*/

        }

        public async Task<int> UpdateContract(ContractVM contractVM)
        {
            // Kueri SQL untuk melakukan update
            string sql = "UPDATE Account " +
                         "SET Start_contract = @StartContract, " +
                         "    End_contract = @EndContract, " +
                         "    Position = @Position " +
                         "WHERE Account_Id = @AccountId";

            // Parameter untuk kueri SQL
            object[] parameters = {
                new SqlParameter("@StartContract", contractVM.StartContract),
                new SqlParameter("@EndContract", contractVM.EndContract),
                new SqlParameter("@Position", contractVM.Position),
                new SqlParameter("@AccountId", contractVM.AccountId)
            };

            // Jalankan kueri SQL secara async
            return await _context.Database.ExecuteSqlRawAsync(sql, parameters);
        }

        public Account GetAccountId(string accountId)
        {
            return _context.Accounts.Find(accountId);
        }

        public int Delete(string key)
        {
            var account = _context.Accounts.Find(key);
            if (account != null)
            {
                var formalEdu = _context.FormalEdus.Where(fe => fe.AccountId == key);
                var nonFormalEdu = _context.NonFormalEdus.Where(nfe => nfe.AccountId == key);
                var qualifications = _context.Qualifications.Where(q => q.AccountId == key);
                var assets = _context.AssetsManagements.Where(a => a.AccountId == key);
                var certificate = _context.Certificates.Where(c => c.AccountId == key);
                var empHistory = _context.EmploymentHistories.Where(eh => eh.AccountId == key);
                var projectHistory = _context.ProjectHistories.Where(ph => ph.AccountId == key);

                if (!formalEdu.IsNullOrEmpty() || !nonFormalEdu.IsNullOrEmpty() || !qualifications.IsNullOrEmpty() || !assets.IsNullOrEmpty() || !certificate.IsNullOrEmpty() || !empHistory.IsNullOrEmpty() || !projectHistory.IsNullOrEmpty())
                {
                    TurnOver turnOver = new TurnOver
                    {
                        TurnOverId = 0,
                        Status = "Resign",
                        ExitDate = DateTime.Now,
                        AccountId = key
                    };

                    _context.TurnOvers.Add(turnOver);
                    _context.SaveChanges();

                    account.RoleId = "4";
                    _context.Accounts.Update(account);
                    return _context.SaveChanges();
                }
                else
                {
                    _context.Accounts.Remove(account);
                    return _context.SaveChanges();
                }
            }
            return 404;
        }
    }


}
