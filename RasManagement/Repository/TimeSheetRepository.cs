using System.Diagnostics;
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

        public async Task<object> GetTimeSheetByCompanyNameAndMonth(string companyName, DateTime targetDate)
        {
            try
            {
                // Step 1: Get PlacementStatusId from Placement table
                var placementStatusIds = await context.Placements
                    .Where(p => p.Client.NameOfClient == companyName)
                    .Select(p => p.PlacementStatusId)
                    .ToListAsync();

                if (placementStatusIds == null || !placementStatusIds.Any())
                {
                    return new List<TimeSheet>();
                }

                // Step 2: Get TimeSheet data based on PlacementStatusIds and month
                var result = await context.TimeSheets
                    .Where(ts => placementStatusIds.Contains((int)ts.PlacementStatusId)
                        && ts.Date.HasValue
                        && ts.Date.Value.Month == targetDate.Month
                        && ts.Date.Value.Year == targetDate.Year)
                    .GroupBy(ts => ts.AccountId)  // Group by AccountId
                    .Select(group => new
                    {
                        AccountId = group.Key,
                        AccountName = group.First().Account.Fullname,
                        Pic = group.First().PlacementStatus.PicName,
                        WFHCount = group.Where(ts => ts.Flag == "WFH").Select(ts => ts.Date).Distinct().Count(), // Count unique dates for WFH
                        WFOCount = group.Where(ts => ts.Flag == "WFO").Select(ts => ts.Date).Distinct().Count(), // Count unique dates for WFO
                        ClientSite = companyName,
                        Position = context.Positions
                               .Where(p => p.Id == group.First().PlacementStatus.PositionId)
                               .Select(p => p.PositionClient)
                               .FirstOrDefault(),
                        TimeSheets = group .OrderBy(ts => ts.Date)
                        .Select(ts => new
                        {
                            TimeSheetId = ts.Id,
                            Activity = ts.Activity,
                            Category = ts.Category,
                            Status = ts.Status,
                            Date = ts.Date,
                            Flag = ts.Flag,
                            KnownBy= ts.KnownBy,
                      /*      IsHoliday = false, // Initialize as false by default
                            HolidayName = ""*/
                        }),

                    })
                    .ToListAsync();

                // Step 3: Get holidays for the target month
      /*          var holidays = await context.MasterHolidays
                    .Where(h => h.Date.Value.Month == targetDate.Month && h.Date.Value.Year == targetDate.Year)
                    .Select(h => h.Date)
                    .ToListAsync();*/
                return result;
            }
            catch (Exception ex)
            {
                // Handle exceptions or log errors
                throw ex;
            }
        }

        public async Task<object> GetTimeSheetsByMonth(DateTime start, DateTime end, string flag, string search, string categories, string status, string placement)
        {
            IQueryable<TimeSheet> query = context.TimeSheets.Include(a => a.Account).Include(p => p.PlacementStatus).ThenInclude(pl => pl.Client);
            int clientId = !string.IsNullOrEmpty(placement) ? Int32.Parse(placement) : 0;

            // Apply mixed filter by flag, category, and status, search, placement
            if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Status == status && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag, category, status, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Status == status && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag, category, and status, search
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Status == status && ts.Activity.Contains(search));
            }
            // Apply mixed filter by flag, category, and status
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Status == status);
            }
            // Apply mixed filter by flag and category, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag and category, search, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag and category, search
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories && ts.Activity.Contains(search));
            }
            // Apply mixed filter by flag and category
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(categories))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Category == categories);
            }
            // Apply mixed filter by flag and status, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Status == status && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag and status, search, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Status == status && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by flag and status, search
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Status == status && ts.Activity.Contains(search));
            }
            // Apply mixed filter by flag and status
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(status))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Status == status);
            }
            // Apply mixed filter by category and status, placement
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Category == categories && ts.Status == status && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by category and status, search, placement
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Category == categories && ts.Status == status && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            // Apply mixed filter by category and status, search
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Category == categories && ts.Status == status && ts.Activity.Contains(search));
            }
            // Apply mixed filter by category and status
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(status))
            {
                query = query.Where(ts => ts.Category == categories && ts.Status == status);
            }
            //Apply mixed filter by flag and placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by flag and search, placement
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by flag and search
            else if (!string.IsNullOrEmpty(flag) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Flag == flag && ts.Activity.Contains(search));
            }
            else if (!string.IsNullOrEmpty(flag))
            {
                query = query.Where(ts => ts.Flag == flag);
            }
            //Apply mixed filter by category and placement
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Category == categories && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by category and search , placement
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Category == categories && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by category and search
            else if (!string.IsNullOrEmpty(categories) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Category == categories && ts.Activity.Contains(search));
            }
            else if (!string.IsNullOrEmpty(categories))
            {
                query = query.Where(ts => ts.Category == categories);
            }
            //Apply mixed filter by status and placement~
            else if (!string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Status == status && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by status, search, placement
            else if (!string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Status == status && ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            //Apply mixed filter by status and search
            else if (!string.IsNullOrEmpty(status) && !string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Status == status && ts.Activity.Contains(search));
            }
            else if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(ts => ts.Status == status);
            }
            //Apply mixed filter by search and placement
            else if (!string.IsNullOrEmpty(search) && !string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.Activity.Contains(search) && ts.PlacementStatus.ClientId == clientId);
            }
            else if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(ts => ts.Activity.Contains(search));
            }
            else if (!string.IsNullOrEmpty(placement))
            {
                query = query.Where(ts => ts.PlacementStatus.ClientId == clientId);
            }

            if (end.Subtract(start).Days > 41)
            {
                var timeSheets = query
                    .GroupBy(ts => new { Date = ts.Date, Flag = ts.Flag })
                    .AsEnumerable()
                    .Select(group => new
                    {
                        start = group.Key.Date,
                        flag = flag,
                        search = search,
                        allDay = true,
                        title = $"{group.Key.Flag}: {group.Select(ts => ts.AccountId).Distinct().Count()}",
                        AccountIds = string.Join(",", group.Select(ts => ts.AccountId).Distinct()),
                        description = string.Join("<br> ", group.Select(ts => ts.Account.Fullname).Distinct()),
                        placement = string.Join("", group.Select(ts => ts.PlacementStatus.Client.NameOfClient).Distinct()),
                        backgroundColor = GetColorByFlag(group.Key.Flag),
                        borderColor = GetColorByFlag(group.Key.Flag),
                    })
                    .ToList();

                return timeSheets;
            }
            else
            {
                var timeSheets = query
                    .GroupBy(ts => new { Date = ts.Date, AccountId = ts.AccountId })
                    .Select(group => new
                    {
                        start = group.Key.Date,
                        title = string.Join(", ", group.Select(ts => ts.Account.Fullname).Distinct()),
                        description = string.Join("<br> ", group.Select(ts => ts.Activity)),
                        placement = string.Join("", group.Select(ts => ts.PlacementStatus.Client.NameOfClient).Distinct()),
                        allDay = true,
                        backgroundColor = GetColorByFlag(group.First().Flag),
                        borderColor = GetColorByFlag(group.First().Flag),
                    })
                    .ToList();

                return timeSheets;
            }
        }

        public async Task<object> GetTimeSheetsByMonthDefault(DateTime start, DateTime end)
        {
            if (end.Subtract(start).Days > 41)
            {
                var timeSheets = context.TimeSheets
                .Include(a => a.Account)
                .GroupBy(ts => new { Date = ts.Date, Flag = ts.Flag })
                .AsEnumerable()
                .Select(group => new
                {
                    start = group.Key.Date,

                    allDay = true,
                    title = $"{group.Key.Flag}: {group.Select(ts => ts.AccountId).Distinct().Count()}",
                    AccountIds = string.Join(",", group.Select(ts => ts.AccountId).Distinct()),
                    description = string.Join("<br> ", group.Select(ts => ts.Account.Fullname).Distinct()),
                    categories = string.Join("<br> ", group.Select(ts => ts.Category).Distinct()),
                    status = string.Join("<br> ", group.Select(ts => ts.Status).Distinct())
                    // backgroundColor = GetColorByFlag(group.Key.Flag),
                    // borderColor = GetColorByFlag(group.Key.Flag),
                })
                .ToList();
                return timeSheets;
            }
            else
            {
                var timeSheets = context.TimeSheets
                .GroupBy(ts => new { Date = ts.Date, AccountId = ts.AccountId })
                .Select(group => new
                {
                    start = group.Key.Date,
                    title = string.Join(", ", group.Select(ts => ts.Account.Fullname).Distinct()),

                    description = string.Join("<br> ", group.Select(ts => ts.Activity)),
                    allDay = true,
                    // backgroundColor = GetColorByFlag(group.KeyFlag),
                    // borderColor = GetColorByFlag(group.Key.Flag),
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
                case "WFH": //dihilangkan
                    return "#f39c12"; // Yellow
                case "Sick":
                    return "#f56954"; // Red
                case "Leave":
                    return "#6c757d"; // Grey
                default:
                    return "#ffffff"; // White
            }
        }

        public static string GetColorByStatus(string status)
        {
            switch (status)
            {
                case "In Progress":
                    return "#0073b7"; // Blue
                case "Pending":
                    return "#f39c12"; // Yellow
                case "Done":
                    return "#00a65a"; // Green
                case "Need Approval":
                    return "#6c757d"; // Grey
                default:
                    return "#f56954"; // Red
            }
        }

        //  public static string GetColorByCategory(string categories)
        // {
        //     switch (categories)
        //     {
        //         case "WFO":
        //             return "#0073b7"; // Blue
        //         case "WFH":
        //             return "#f39c12"; // Yellow
        //         case "WFC":
        //             return "#00a65a"; // Green
        //         case "Sick":
        //             return "#6c757d"; // Grey
        //         case "Leave":
        //             return "#6c757d"; // Grey
        //         default:
        //             return "#f56954"; // Red
        //     }
        // }

        public int AddTimeSheet(TimeSheet timeSheet)
        {
            // Validasi Flag harus sama
            var data = context.TimeSheets.FirstOrDefault(t => t.AccountId == timeSheet.AccountId && t.Date == timeSheet.Date);

            if (data != null)
            {
                if (data.Flag == "Sick" || data.Flag == "Leave")
                {
                    return 406;
                }
                else if (data.Flag == timeSheet.Flag)
                {
                    context.TimeSheets.Add(timeSheet);
                    return context.SaveChanges();
                }
                else
                {
                    return 400;
                }
            }
            else
            {
                context.TimeSheets.Add(timeSheet);
                return context.SaveChanges();
            }

            // Validasi untuk memastikan tanggal unik
            // if (IsDateUnique(timeSheet.AccountId, timeSheet.Date))
            // {
            //     context.TimeSheets.Add(timeSheet);
            //     return context.SaveChanges();
            // }
            // return 400;
        }

        public int UpdateTimeSheet(TimeSheet data)
        {
            // Validasi Flag harus sama
            var result = context.TimeSheets.FirstOrDefault(t => t.AccountId == data.AccountId && t.Date == data.Date);

            if (result != null)
            {
                if (result.Flag == data.Flag)
                {
                    var timesheet = context.TimeSheets.Find(data.Id);
                    timesheet.Activity = data.Activity;
                    timesheet.Flag = data.Flag;
                    timesheet.Date = data.Date;
                    timesheet.Category = data.Category;
                    timesheet.Status = data.Status;
                    timesheet.KnownBy = data.KnownBy;
                    timesheet.AccountId = data.AccountId;
                    timesheet.PlacementStatusId = data.PlacementStatusId;
                    Console.WriteLine("same");
                    return context.SaveChanges();
                }
                else
                {
                    Console.WriteLine("not same");
                    return 304;
                }
            }
            else
            {
                var timesheet = context.TimeSheets.Find(data.Id);
                timesheet.Activity = data.Activity;
                timesheet.Flag = data.Flag;
                timesheet.Date = data.Date;
                timesheet.Category = data.Category;
                timesheet.Status = data.Status;
                timesheet.KnownBy = data.KnownBy;
                timesheet.AccountId = data.AccountId;
                timesheet.PlacementStatusId = data.PlacementStatusId;
                Console.WriteLine("null");
                return context.SaveChanges();
            }
        }

        public bool IsDateUnique(string accountId, DateTime? targetDate)
        {
            // Cek apakah tanggal sudah digunakan untuk TimeSheet lain
            return !context.TimeSheets.Any(ts => ts.AccountId == accountId && ts.Date == targetDate);
        }

        internal async Task GetTimeSheetsByMonth(DateTime start, DateTime end, string? flag, string? search, string? categories, string? status, int? placement)
        {
            throw new NotImplementedException();
        }
    }
}