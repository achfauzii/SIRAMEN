using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RasManagement.Interface;
using System.Collections.Generic;
using System.Linq;
using RasManagement.ViewModel;
using RasManagement.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Data.SqlClient;

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
            var employees = _context.Accounts.Include(a => a.AssetsManagements).Include(a => a.Placements).ThenInclude(pl => pl.Client)
                            .Where(a => a.RoleId == "3");
            return employees;

        }

        public async Task<IEnumerable<Object>> GetTurnOff()
        {

            var accounts = _context.Accounts.Include(a => a.Placements).Where(a => a.RoleId == "4");
            return accounts;

        }
        public async Task<IEnumerable<Object>> GetAccountData()
        {
            var accounts = _context.Accounts.Where(a => a.RoleId == "3" || a.RoleId == "2" || a.RoleId == "5" || a.RoleId == "6" || a.RoleId == "7");
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
            if (!string.IsNullOrEmpty(updatedData.financialIndustry))
            {
                existingEmployee.FinancialIndustry = updatedData.financialIndustry;
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

        public async Task<IEnumerable<Object>> GetEmployeeFilter(string position, string hiredStatus, string level, string financialIndustry, string placementStatus, string placementLocation)
        {
            //var data = _context.Accounts.Where(emp => emp.RoleId == "3").Include(p => p.Placements).ThenInclude(c => c.Client).AsQueryable();
            ////int clientId = !string.IsNullOrEmpty(placementLocation) ? Int32.Parse(placementLocation) : 0;

            ////FILTER 6 CONDITION
            //if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}

            ////FILTER 5 CONDITION
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}

            ////FILTER 4 CONDITION
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Level == level && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Hiredstatus == hiredStatus);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(placementLocation))
            //{

            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}

            ////FILTER 3 CONDITION
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Level == level && emp.FinancialIndustry == financialIndustry);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Hiredstatus == hiredStatus);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Level == level && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Hiredstatus == hiredStatus);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(hiredStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}

            ////FILTER 2 CONDITION
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(level))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Level == level);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(placementStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Position == position && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Position == position && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.FinancialIndustry == financialIndustry);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Hiredstatus == hiredStatus);
            //}
            //else if (!string.IsNullOrEmpty(position) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.Position == position && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}

            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => emp.Level == level && (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Level == level && emp.Placements.Any(ps => ps.PlacementStatus == placementStatus));
            //    }
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    data = data.Where(emp => emp.Level == level && emp.FinancialIndustry == financialIndustry );
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(hiredStatus) )
            //{
            //    data = data.Where(emp => emp.Level == level && emp.Hiredstatus == hiredStatus);
            //}
            //else if (!string.IsNullOrEmpty(level) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.Level == level && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}

            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        Console.WriteLine("Filter Idle");
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Hiredstatus == hiredStatus);
            //    }
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //    }
            //}

            //else if (!string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    data = data.Where(emp => emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //}
            //else if (!string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.FinancialIndustry == financialIndustry && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}
            ////apply mix filtering by hired status
            //else if (!string.IsNullOrEmpty(hiredStatus) && !string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.Hiredstatus == hiredStatus && emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}
            //else if (!string.IsNullOrEmpty(placementStatus) && !string.IsNullOrEmpty(financialIndustry) && !string.IsNullOrEmpty(hiredStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => (!emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus)) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus) && emp.FinancialIndustry == financialIndustry && emp.Hiredstatus == hiredStatus);
            //    }
            //}

            //else if (!string.IsNullOrEmpty(position))
            //{
            //    data = data.Where(emp => emp.Position == position);
            //}

            //else if (!string.IsNullOrEmpty(level))
            //{
            //    data = data.Where(emp => emp.Level == level);
            //}

            //else if (!string.IsNullOrEmpty(hiredStatus))
            //{
            //    data = data.Where(emp => emp.Hiredstatus == hiredStatus);
            //}

            //else if (!string.IsNullOrEmpty(financialIndustry))
            //{
            //    data = data.Where(emp => emp.FinancialIndustry == financialIndustry);
            //}

            //else if (!string.IsNullOrEmpty(placementStatus))
            //{
            //    if (placementStatus == "Idle")
            //    {
            //        data = data.Where(emp => !emp.Placements.Any() || emp.Placements.Any(ps => ps.PlacementStatus == placementStatus));
            //    }
            //    else
            //    {
            //        data = data.Where(emp => emp.Placements.Any(ps => ps.PlacementStatus == placementStatus));
            //    }
            //}

            //else if (!string.IsNullOrEmpty(placementLocation))
            //{
            //    data = data.Where(emp => emp.Placements.Any(pl => pl.Client.NameOfClient == placementLocation));
            //}


            //var result = data.ToList();


            var employees = _context.Accounts
        .FromSqlRaw($"EXEC FILTER_EMPLOYEE " +
            $"@v_Level='{level}', " +
            $"@v_Financial='{financialIndustry}', " +
            $"@v_Status='{placementStatus}', " +
            $"@v_Hired='{hiredStatus}', " +
            $"@v_Position='{position}', " +
            $"@v_Placement='{placementLocation}'"
        )
        .ToList();

            // Sekarang tambahkan entitas terkait
            _context.Accounts
                .Include(a => a.Placements)        // Menyertakan entitas terkait Placements
                    .ThenInclude(pl => pl.Client)  // Menyertakan entitas terkait Client dalam Placements
                .Load();
            return employees;
        }
    }

}
