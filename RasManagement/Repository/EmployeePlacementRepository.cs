﻿using Microsoft.EntityFrameworkCore;
using RasManagement.Models;
using RasManagement.Interface;
using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class EmployeePlacementRepository : GeneralRepository<ProjectRasmanagementContext, Placement, int>
    {
        private readonly ProjectRasmanagementContext _context;
        public EmployeePlacementRepository(ProjectRasmanagementContext _context) : base(_context)
        {
            this._context = _context;
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


        public async Task<int> AddPlacement(PlacementVM placementVM)
        {
            var placement = new Placement
            {
                PlacementStatusId = placementVM.PlacementStatusId,
                CompanyName = placementVM.CompanyName,
                Description = placementVM.Description,
                PlacementStatus = placementVM.PlacementStatus,
                AccountId = placementVM.AccountId,

            };
            _context.Placements.Add(placement);

            var insert = _context.SaveChanges();
            return insert;
        }

        public Placement GetAccount(string key)

        {
            var placement = _context.Placements.SingleOrDefault(a => a.AccountId == key);

            return placement;
        }


        public async Task<int> UpdatePlacement(PlacementVM placementVM)
        {

            var placement = new Placement
            {
                PlacementStatusId = placementVM.PlacementStatusId,
                CompanyName = placementVM.CompanyName,
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
    }
}
