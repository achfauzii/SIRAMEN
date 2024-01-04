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

        public async Task<List<TimeSheet>> GetTimeSheetsByAccountIdAndDate(string accountId, DateTime targetDate)
        {
            var timeSheets = await context.TimeSheets
                .Where(ts => ts.AccountId == accountId
                        && ts.Date.HasValue // Pastikan ada tanggal yang ada
                        && ts.Date.Value.Date == targetDate.Date)
                .ToListAsync();

            return timeSheets;
        }
    }
}
