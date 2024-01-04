namespace RasManagement.Repository
{
    public class TimeSheetRepository : GeneralRepository<ProjectRasmanagementContext, TimeSheet, int>
    {
        private readonly ProjectRasmanagementContext context;

        public TimeSheetRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<TimeSheet>> GetTimeSheetsByAccount(string accountId)
        {
            var timeSheetAccount = await context.TimeSheets
                .Where(e => e.AccountId == accountId)
                .ToListAsync();

            return timeSheetAccount;
        }
    }
}
