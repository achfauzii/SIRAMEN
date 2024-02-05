﻿using Microsoft.EntityFrameworkCore;
using System.Linq;

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
                    .Where(p => p.CompanyName == companyName)
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
                        WFHCount = group.Count(ts => ts.Flag == "WFH"),
                        WFOCount = group.Count(ts => ts.Flag == "WFO"),
                        TimeSheets = group.Select(ts => new
                        {
                            TimeSheetId = ts.Id,

                        }),

                    })
                    .ToListAsync();

                return result;

            }
            catch (Exception ex)
            {
                // Handle exceptions or log errors
                throw ex;
            }
        }



        public async Task<object> GetTimeSheetsByMonth(DateTime start, DateTime end)
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
                      AccountInfo = group.Select(ts => new
                      {
                          AccountId = ts.AccountId,
                          AccountName = ts.Account.Fullname
                      }).Distinct(),
                  })
                  .ToList();
                return timeSheets;
            }
            else
            {
                var timeSheets = await context.TimeSheets
                .GroupBy(ts => new { Date = ts.Date, AccountId = ts.AccountId })
                .Select(group => new
                {
                    start = group.Key.Date,
                    title = string.Join(", ", group.Select(ts => ts.Account.Fullname).Distinct()),

                    description = string.Join("<br> ", group.Select(ts => ts.Activity)),
                    allDay = true
                })
                .ToListAsync();
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
