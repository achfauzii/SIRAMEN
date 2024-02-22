using Microsoft.EntityFrameworkCore;
using RasManagement.Models;
using RasManagement.Interface;
using RasManagement.ViewModel;
using Org.BouncyCastle.Pqc.Crypto.Lms;

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
    }
}