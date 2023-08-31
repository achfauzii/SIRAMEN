﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using RasManagement.Interface;
using System.Collections.Generic;
using System.Linq;
using RasManagement.ViewModel;
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
            /*var blacklist = _context.Placements
                .Where(p => p.PlacementStatus == "Onsite" || p.PlacementStatus == "Idle")
                .Select(p => p.AccountId);

            var employees = _context.Accounts.Where(a => (a.RoleId == "3" || a.RoleId == "2") && blacklist.Contains(a.AccountId));
            return employees;*/
        }

        public async Task<IEnumerable<Object>> GetTurnOff()
        {
            var blacklist = _context.Placements
                .Where(p => p.PlacementStatus == "Blacklist" || p.PlacementStatus == "Resign")
                .Select(p => p.AccountId);

            var employees = _context.Accounts.Where(a => (a.RoleId == "3" || a.RoleId == "2")&& blacklist.Contains(a.AccountId));
            return employees;

        }

        public Task<Account> Get(string key)

        {
            var account = _context.Accounts.SingleOrDefaultAsync(a => a.AccountId == key && (a.RoleId == "2" || a.RoleId == "3"));

            return account;
        }
        public async Task<bool> Update(string accountId,UpdateEmployeeVM updatedData)
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
            if (!string.IsNullOrEmpty(updatedData.Image))
            {
                existingEmployee.Image = updatedData.Image;
            }

            _context.Update(existingEmployee);
            await _context.SaveChangesAsync();

            return true;
        }



        //Employeement


    }
}
