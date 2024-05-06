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
                .Where(e => e.ProjectStatus == status)
                .ToListAsync();

            return data;
        }
    }
}