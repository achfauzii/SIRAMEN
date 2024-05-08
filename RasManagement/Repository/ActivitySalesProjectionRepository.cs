namespace RasManagement.Repository
{
    public class ActivitySalesProjectionRepository : GeneralRepository<ProjectRasmanagementContext, ActivitySalesProjection, int>
    {
        private readonly ProjectRasmanagementContext context;

        public ActivitySalesProjectionRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<ActivitySalesProjection>> GetBySpId(int id)
        {
            var data = await context.ActivitySalesProjections
                .Where(e => e.SPId == id)     
                .ToListAsync();

            return data;
        }
    }
}
