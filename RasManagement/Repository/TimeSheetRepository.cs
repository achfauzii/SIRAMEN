using Microsoft.EntityFrameworkCore;

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

        public async Task<List<TimeSheet>> GetTimeSheetsByAccountIdAndMonth(string accountId, DateTime targetDate)
        {
            var timeSheets = await context.TimeSheets
                .Where(ts => ts.AccountId == accountId
                        && ts.Date.HasValue
                        && ts.Date.Value.Month == targetDate.Month
                        && ts.Date.Value.Year == targetDate.Year)
                .ToListAsync();

            return timeSheets;
        }

        public int AddTimeSheet(TimeSheet timeSheet)
        {
            // Validasi untuk memastikan tanggal unik
            if (IsDateUnique(timeSheet.AccountId, timeSheet.Date))
            {
                context.TimeSheets.Add(timeSheet);
                return context.SaveChanges();
            }
            return 400;
        }

        public bool IsDateUnique(string accountId, DateTime? targetDate)
        {
            // Cek apakah tanggal sudah digunakan untuk TimeSheet lain
            return !context.TimeSheets.Any(ts => ts.AccountId == accountId && ts.Date == targetDate);
        }

        /*public async Task<List<TimeSheet>> GetCurrentMonth(string accountId)
        {
            var today = DateTime.Today;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var timeSheetAccount = await context.TimeSheets
                .Where(e => e.AccountId == accountId && e.Date >= firstDayOfMonth && e.Date <= lastDayOfMonth)
                .ToListAsync();

            return timeSheetAccount;
        }*/

    }
}
