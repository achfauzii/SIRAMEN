namespace RasManagement.Repository
{
    public class TurnOverRepository : GeneralRepository<ProjectRasmanagementContext, TurnOver, int>
    {
        private readonly ProjectRasmanagementContext context;

        public TurnOverRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<List<TurnOver>> GetEducationByAccountId(string accountId)
        {
            var turnOverEmployee = await context.TurnOvers
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return turnOverEmployee;
        }

    }
}
