namespace RasManagement.Repository
{
    public class SalesProjectionRepository : GeneralRepository<ProjectRasmanagementContext, SalesProjection, int>
    {
        private readonly ProjectRasmanagementContext context;

        public SalesProjectionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<SalesProjection>> GetByStatus(string status)
        {
            var data = await context.SalesProjections
                .Where(e => e.Status == status)
                .ToListAsync();

            return data;
        }
    }
}