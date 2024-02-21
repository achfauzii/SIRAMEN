using RasManagement.ViewModel;

namespace RasManagement.Repository
{
    public class PositionRepository : GeneralRepository<ProjectRasmanagementContext, Position, int>
    {
        private readonly ProjectRasmanagementContext context;

        public PositionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<PositionByClient>> GetPositionByClientId(int clientId)
        {
            var positionClient = await context.Positions
                .Include(c => c.Client)
                .Where(e => e.ClientId == clientId)
                .Select(d => new PositionByClient
                {
                    Id = d.Id,
                    PositionClient = d.PositionClient,
                    Level = d.Level,
                    Quantity = d.Quantity,
                    Status = d.Status,
                    Notes = d.Notes,
                    ClientId = d.ClientId,
                    ClientName = d.Client.NameOfClient
                })
                .ToListAsync();

            return positionClient;
        }

        public async Task<bool> PositionNameIsExist(string name, int? clientId = null, string? level = null)
        {
            // Use AnyAsync to check if any department with the given name exists
            var positionExists = await context.Positions.AnyAsync(a => a.PositionClient.ToLower() == name.ToLower() && a.ClientId == clientId && a.Level == level);

            return positionExists;
        }
        public int InsertPosition(Position position)
        {
            context.Positions.Add(position);
            var insert = context.SaveChanges();
            return insert;
        }

    }
}
