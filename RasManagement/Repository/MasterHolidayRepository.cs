namespace RasManagement.Repository
{
    public class MasterHolidayRepository : GeneralRepository<ProjectRasmanagementContext, MasterHoliday, int>
    {
        private readonly ProjectRasmanagementContext context;

        public MasterHolidayRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        /*public async Task<List<MasterHoliday>> GetHolidaysByAccountId(string accountId)
        {
            var holidaysAccount = await context.MasterHolidays
             .Where(e => e.AccountId == accountId)
             .ToListAsync();

            return holidaysAccount;
        }*/

        public IEnumerable<MasterHoliday> getHolidayByDate(DateTime date)
        {
            return context.MasterHolidays.Where(e => e.Date == date);
        }

        public bool CheckHolidayByDate(DateTime date)
        {
            var day = context.MasterHolidays.Where(e => e.Date == date);
            if (day != null)
            {
                return true;
            }
            return false;
        }
    }
}
