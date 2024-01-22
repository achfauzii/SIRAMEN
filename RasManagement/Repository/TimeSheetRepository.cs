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
        public async Task<object> GetTimeSheetsByMonth(DateTime start, DateTime end)
        {
            if (end.Subtract(start).Days > 41){
                var timeSheets =  context.TimeSheets
                .Where(ts => ts.Date >= start && ts.Date <= end)
                .Include(a => a.Account)
                .GroupBy(ts => ts.Date);
                var resultWithTitles = new List<object>();
                foreach (var dayGroup in timeSheets){
                    var countFlag = dayGroup
                    .GroupBy(a => a.Flag)
                    .Select(flagGroup => new {
                        title = $"{flagGroup.Key}: \n {flagGroup.Count()}",
                        description = "ini deskripsi bulan",
                        start = dayGroup.Key,
                        allDay = true,
                        flag = flagGroup.First().Flag,
                        backgroundColor = GetColorByFlag(flagGroup.First().Flag),
                        borderColor = GetColorByFlag(flagGroup.First().Flag),
                    })
                .ToList();
                resultWithTitles.AddRange(countFlag);
                }
                
                return resultWithTitles.Cast<object>().ToList();;
                
               
                } else {
                    var timeSheets = await context.TimeSheets
                    .Include(a=> a.Account)
                    .Where(ts => ts.Date >= start
                                && ts.Date <= end)
                    .Select(ts => new {
                        title = ts.Account.Fullname +": \n"+ ts.Activity,
                        start = ts.Date,
                        description = "ini deskripsi minggu",
                        allDay = true,
                        backgroundColor = GetColorByFlag(ts.Flag),
                        borderColor = GetColorByFlag(ts.Flag),

                    })
                    .ToListAsync();
                    return timeSheets;
                }
        }
        public static string GetColorByFlag(string flag) {
        switch (flag)
            {
                case "WFO":
                    return "#0073b7"; // Blue
                case "WFH":
                    return "#f39c12"; // Yellow
                case "WFC":
                    return "#00a65a"; // Green
                case "Sakit":
                    return "#6c757d"; // Grey
                case "Cuti":
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
