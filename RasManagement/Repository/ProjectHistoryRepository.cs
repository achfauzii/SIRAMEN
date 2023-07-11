namespace RasManagement.Repository
{
    public class ProjectHistoryRepository : GeneralRepository<ProjectRasmanagementContext, ProjectHistory, int>
    {
        private readonly ProjectRasmanagementContext context;
        public ProjectHistoryRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<ProjectHistory>> GetProjectHistoryByAccountId(string accountId)
        {
            var projectHistoryAccount = await context.ProjectHistories
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return projectHistoryAccount;
        }
    }
}
