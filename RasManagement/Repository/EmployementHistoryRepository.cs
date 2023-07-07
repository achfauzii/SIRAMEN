using RasManagement.Interface;

namespace RasManagement.Repository.Data
{
    public class EmploymentHistoryRepository : GeneralRepository<ProjectRasmanagementContext, EmploymentHistory, int>
    {
        private readonly ProjectRasmanagementContext context;
        public EmploymentHistoryRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<EmploymentHistory>> GetEmploymentByAccountId(string accountId)
        {
            var employmentAccount = await context.EmploymentHistories
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return employmentAccount;
        }
    }
}