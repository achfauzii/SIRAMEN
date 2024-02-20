namespace RasManagement.Repository
{
    public class PositionRepository : GeneralRepository<ProjectRasmanagementContext, Position, int>
    {
        private readonly ProjectRasmanagementContext context;

        public PositionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<Position>> GetPositionByClientId(int clientId)
        {
            var positionClient = await context.Positions
                .Where(e => e.ClientId == clientId)
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
