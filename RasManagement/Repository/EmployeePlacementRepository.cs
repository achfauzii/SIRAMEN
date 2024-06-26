﻿using Microsoft.EntityFrameworkCore;
using RasManagement.Models;
using RasManagement.Interface;
using RasManagement.ViewModel;
using Org.BouncyCastle.Pqc.Crypto.Lms;
using Microsoft.Data.SqlClient;
using System.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace RasManagement.Repository
{
    public class EmployeePlacementRepository : GeneralRepository<ProjectRasmanagementContext, Placement, int>
    {
        private readonly ProjectRasmanagementContext _context;
        private readonly IConfiguration configuration;
        public EmployeePlacementRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
            this.configuration = configuration;
        }

        public async Task<bool> AccountIsExist(string accountId)
        {


            var accountIdIsExist = _context.Placements.SingleOrDefault(a => a.AccountId == accountId);

            if (accountIdIsExist != null)
            {

                return true;
            }

            return false;
        }

        public EmployeePlacementVM GetPlacementId(int placementStatusId)
        {
            // Assuming you can uniquely identify a placement based on Client_Id, Position_Id, and PlacementStatusId
            return _context.Placements
                .Include(p => p.Client)
                .Include(p => p.Position)
                .Select(p => new EmployeePlacementVM
                {
                    PlacementStatusId = p.PlacementStatusId,
                    ClientId = p.ClientId,
                    PositionId = p.PositionId,
                    PicName = p.PicName,
                    PicRas = p.PicRas,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    Description = p.Description,
                    PlacementStatus = p.PlacementStatus,
                    AccountId = p.AccountId,
                    Client = p.Client,
                    Position = p.Position,
                })
                .FirstOrDefault(p => p.PlacementStatusId == placementStatusId);
        }



        public async Task<IEnumerable<Placement>> Get()
        {
            return await _context.Placements.ToListAsync();
        }

        public async Task<int> AddPlacement(PlacementVM placementVM)
        {
            var placement = new Placement
            {
                PlacementStatusId = placementVM.PlacementStatusId,
                ClientId = placementVM.ClientId,
                PositionId = placementVM.PositionId,
                PicName = placementVM.PicName,
                PicRas = placementVM.PicRas,
                StartDate = placementVM.StartDate,
                EndDate = placementVM.EndDate,
                Description = placementVM.Description,
                PlacementStatus = placementVM.PlacementStatus,
                AccountId = placementVM.AccountId,
            };
            _context.Placements.Add(placement);

            var insert = _context.SaveChanges();
            return insert;
        }

        public async Task<int> AddTurnOver(TurnOverVM turnOverVM)
        {
            var placement = new Placement
            {
                PlacementStatusId = turnOverVM.PlacementStatusId,
                ClientId = turnOverVM.ClientId,
                PlacementStatus = turnOverVM.PlacementStatus,
                Description = turnOverVM.Description,
                AccountId = turnOverVM.AccountId,

            };
            _context.Placements.Add(placement);

            var insert = _context.SaveChanges();
            return insert;
        }

        public List<EmployeePlacementVM> GetAccount(string accountId)

        {
            var placements = _context.Placements
                     .Include(c => c.Client)
                     .Include(p => p.Position)
                     .Where(a => a.AccountId == accountId)
                     .OrderByDescending(a => a.PlacementStatusId)
                     .Select(p => new EmployeePlacementVM
                     {
                         PlacementStatusId = p.PlacementStatusId,
                         ClientId = p.ClientId,
                         PositionId = p.PositionId,
                         PicName = p.PicName,
                         PicRas = p.PicRas,
                         StartDate = p.StartDate,
                         EndDate = p.EndDate,
                         Description = p.Description,
                         PlacementStatus = p.PlacementStatus,
                         AccountId = p.AccountId,
                         Client = p.Client,
                         Position = p.Position,
                     })
                     .ToList();

            return placements;
        }


        public async Task<int> UpdatePlacement(PlacementVM placementVM)
        {

            var placement = new Placement
            {
                PlacementStatusId = placementVM.PlacementStatusId,
                ClientId = placementVM.ClientId,
                PositionId = placementVM.PositionId,
                PicName = placementVM.PicName,
                PicRas = placementVM.PicRas,
                StartDate = placementVM.StartDate,
                EndDate = placementVM.EndDate,
                Description = placementVM.Description,
                PlacementStatus = placementVM.PlacementStatus,
                AccountId = placementVM.AccountId,

            };

            _context.Entry(placement).State = EntityState.Modified;
            return _context.SaveChanges();
            /* _context.Placements.Add(placement);

             var insert = _context.SaveChanges();
             return insert;
         }*/
        }


        //Detail Emp for Pie Chart

        public async Task<IEnumerable<StatusEmpVM>> GetStatusEmp()
        {
            // Mengambil data Placement dengan PlacementStatus == "Onsite" dan termasuk data Account
            var status = await _context.Placements
                                       .Include(p => p.Account) // Include Account entity
                                       .Where(p => p.PlacementStatus == "OnSite")
                                       .ToListAsync();

            // Mengelompokkan data berdasarkan AccountId dan memilih PlacementStatus pertama yang sesuai
            var statusViewModels = status
                .GroupBy(p => p.AccountId)
                .Select(g => new StatusEmpVM
                {
                    AccountId = g.Key,
                    PlacementStatus = g.First().PlacementStatus,
                    JoinDate = g.First().Account?.JoinDate // Mengambil JoinDate dari Account yang terkait
                })
                .ToList();

            return statusViewModels;
        }
        public async Task<IEnumerable<object>> GetEmployeeOnsite()
        {
            var employees = _context.Accounts
                .FromSqlRaw("EXEC GetEmpOnsite")
                .AsEnumerable()
                .Select(a => new { Email = a.Email, Fullname = a.Fullname })
                .ToList();

            return employees;
        }




    }




}