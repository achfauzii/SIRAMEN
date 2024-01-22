using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RasManagement.Interface;
using System.Collections.Generic;
using System.Linq;
using RasManagement.ViewModel;
namespace RasManagement.Repository
{
    public class EmployeeRepository : GeneralRepository<ProjectRasmanagementContext, Account, string>
    {
        private readonly ProjectRasmanagementContext _context;
        public EmployeeRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
        }
        public async Task<IEnumerable<Object>> GetEmployeeData()
        {
            var employees = _context.Accounts.Include(a => a.AssetsManagements).Include(a => a.Placements).Where(a => a.RoleId == "3");
            return employees;

        }

        public async Task<IEnumerable<Object>> GetTurnOff()
        {

            var accounts = _context.Accounts.Include(a => a.Placements).Where(a => a.RoleId == "4");
            return accounts;

        }
        public async Task<IEnumerable<Object>> GetAccountData()
        {
            var accounts = _context.Accounts.Where(a => a.RoleId == "3" || a.RoleId == "2");
            return accounts;

        }
        public Task<Account> Get(string key)

        {
            var account = _context.Accounts.SingleOrDefaultAsync(a => a.AccountId == key && (a.RoleId == "2" || a.RoleId == "3"));

            return account;
        }
        public async Task<bool> Update(string accountId, UpdateEmployeeVM updatedData)
        {
            var existingEmployee = await _context.Accounts.SingleOrDefaultAsync(a => a.AccountId == accountId && (a.RoleId == "2" || a.RoleId == "3"));

            if (existingEmployee == null)
            {
                return false; // Employee not found or doesn't have the correct role
            }

            if (!string.IsNullOrEmpty(updatedData.Fullname))
            {
                existingEmployee.Fullname = updatedData.Fullname;
            }
            if (!string.IsNullOrEmpty(updatedData.Nickname))
            {
                existingEmployee.Nickname = updatedData.Nickname;
            }
            if (!string.IsNullOrEmpty(updatedData.Birthplace))
            {
                existingEmployee.Birthplace = updatedData.Birthplace;
            }
            if (updatedData.Birthdate.HasValue)
            {
                existingEmployee.Birthdate = updatedData.Birthdate.Value;
            }
            if (!string.IsNullOrEmpty(updatedData.Gender))
            {
                existingEmployee.Gender = updatedData.Gender;
            }
            if (!string.IsNullOrEmpty(updatedData.Religion))
            {
                existingEmployee.Religion = updatedData.Religion;
            }
            if (!string.IsNullOrEmpty(updatedData.Maritalstatus))
            {
                existingEmployee.Maritalstatus = updatedData.Maritalstatus;
            }
            if (!string.IsNullOrEmpty(updatedData.Nationality))
            {
                existingEmployee.Nationality = updatedData.Nationality;
            }
            if (!string.IsNullOrEmpty(updatedData.Address))
            {
                existingEmployee.Address = updatedData.Address;
            }
            if (!string.IsNullOrEmpty(updatedData.Image))
            {
                existingEmployee.Image = updatedData.Image;
            }
            if (!string.IsNullOrEmpty(updatedData.level))
            {
                existingEmployee.Level = updatedData.level;
            }

            _context.Update(existingEmployee);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Object>> CheckOverviewEmployee()
        {
            var employees = _context.Accounts
                                    .Include(e => e.FormalEdus)
                                    .Include(ne => ne.NonFormalEdus)
                                    .Include(q => q.Qualifications)
                                    .Include(c => c.Certificates)
                                    .Include(eh => eh.EmploymentHistories)
                                    .Include(ph => ph.ProjectHistories)
                                    .Where(con => con.RoleId == "3")
                                    .ToList();
            return employees;
        }

    }
}
