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

        /*public async Task<TimeSheet> AddTimeSheet(string accountId, DateTime targetDate)
        {
            // Validasi untuk memastikan tanggal unik
            if (await IsDateUnique(accountId, targetDate))
            {
                // Jika tanggal unik, tambahkan TimeSheet ke database
                var timeSheet = new TimeSheet
                {
                    AccountId = accountId,
                    Date = targetDate,
                    // ... // Set other properties of TimeSheet as needed
                };

                // Simpan TimeSheet ke database
                context.TimeSheets.Add(timeSheet);
                await context.SaveChangesAsync();

                return timeSheet;
            }
            else
            {
                // Tanggal tidak unik, lempar exception atau kembalikan nilai sesuai kebutuhan
                throw new InvalidOperationException("Tanggal sudah digunakan untuk TimeSheet lain.");
            }
        }

        private async Task<bool> IsDateUnique(string accountId, DateTime targetDate)
        {
            // Cek apakah tanggal sudah digunakan untuk TimeSheet lain
            return !await context.TimeSheets.AnyAsync(ts => ts.AccountId == accountId && ts.Date == targetDate);
        }*/

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


    }
}
