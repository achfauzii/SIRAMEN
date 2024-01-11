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
    }
}
