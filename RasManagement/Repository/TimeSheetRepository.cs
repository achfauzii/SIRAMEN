using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Tsp;

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

        public async Task<List<TimeSheet>> GetTimeSheetsActivity(string accountId, DateTime date)
        {
            var timeSheetAccount = await context.TimeSheets
                .Where(e => e.AccountId == accountId && e.Date == date)
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
        public async Task<object> GetTimeSheetsByMonth(DateTime start, DateTime end, String flag, String Search)
        {   
          if(!string.IsNullOrEmpty(flag)){
             var timeSheets = context.TimeSheets
              .Include(a => a.Account)
              .Where(ts => ts.Flag == flag)
              .GroupBy(ts => new { Date = ts.Date, Flag = ts.Flag })
              .AsEnumerable()
              .Select(group => new
              {
                  start = group.Key.Date,
                  flag= flag,
                  search = Search,
                  allDay= true,
                  title = $"{group.Key.Flag}: {group.Select(ts => ts.AccountId).Distinct().Count()}",
                  AccountIds = string.Join(",", group.Select(ts => ts.AccountId).Distinct()),
                  description = string.Join("<br> ", group.Select(ts => ts.Account.Fullname).Distinct()),
                 
                })
              .ToList();
              return timeSheets;
          }

          if (end.Subtract(start).Days > 41)
            {
              var timeSheets = context.TimeSheets
              .Include(a => a.Account)
              .GroupBy(ts => new { Date = ts.Date, Flag = ts.Flag })
              .AsEnumerable()
              .Select(group => new
              {
                  start = group.Key.Date,
                  flag= flag,
                  search = Search,
                  allDay= true,
                  title = $"{group.Key.Flag}: {group.Select(ts => ts.AccountId).Distinct().Count()}",
                  AccountIds = string.Join(",", group.Select(ts => ts.AccountId).Distinct()),
                  description = string.Join("<br> ", group.Select(ts => ts.Account.Fullname).Distinct()),
                 
                })
              .ToList();
              return timeSheets;
          } else {
            var timeSheets = context.TimeSheets
            .GroupBy(ts => new { Date = ts.Date, AccountId = ts.AccountId })
            .Select(group => new
            {
                start = group.Key.Date,
                title = string.Join(", ", group.Select(ts => ts.Account.Fullname).Distinct()),
                
                description = string.Join("<br> ", group.Select(ts => ts.Activity)),
                allDay = true
            })
            .ToList();
            return timeSheets;
          }
        }
        public static string GetColorByFlag(string flag)
        {
            switch (flag)
            {
                case "WFO":
                    return "#0073b7"; // Blue
                case "WFH":
                    return "#f39c12"; // Yellow
                case "WFC":
                    return "#00a65a"; // Green
                case "Sick":
                    return "#6c757d"; // Grey
                case "Leave":
                    return "#6c757d"; // Grey
                default:
                    return "#f56954"; // Red
            }
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
