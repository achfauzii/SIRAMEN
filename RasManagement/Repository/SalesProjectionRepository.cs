namespace RasManagement.Repository
{
    public class SalesProjectionRepository : GeneralRepository<ProjectRasmanagementContext, SalesProjection, int>
    {
        private readonly ProjectRasmanagementContext context;

        public SalesProjectionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<SalesProjection>> GetByProjectionStatus(string status)
        {
            var data = await context.SalesProjections
                .Where(e => e.ProjectStatus.ToLower() == status)
                .Include(e => e.Client)
                .ToListAsync();

            return data;
        }

        public async Task<List<SalesProjection>> GetByClientId(int clientId)
        {
            var data = await context.SalesProjections
                .Where(e => e.ClientId == clientId)
                .Include(e => e.Client)
                .ToListAsync();

            return data;
        }

        public async Task<List<SalesProjection>> getFullData()
        {
            var data = await context.SalesProjections
                .Include(e => e.Client)
                .ToListAsync();
            return data;
        }
    }
}