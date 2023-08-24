using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RasManagement.Interface;
using System.Collections.Generic;
using System.Linq;
namespace RasManagement.Repository
{
    public class EmployeeRepository: GeneralRepository<ProjectRasmanagementContext, Account, string>
    {
        private readonly ProjectRasmanagementContext _context;
        public EmployeeRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
        }
        public async Task<IEnumerable<Object>> GetEmployeeData()
        {
            var employees = _context.Accounts.Where(a => a.RoleId == "3" || a.RoleId == "2");
            return employees;

        }

        public Task<Account> Get(string key)

        {
            var account = _context.Accounts.SingleOrDefaultAsync(a => a.AccountId == key && (a.RoleId == "2" || a.RoleId == "3"));

            return account;
        }


        //Employeement


    }
}
