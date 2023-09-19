using RasManagement.Controllers;

namespace RasManagement.Repository
{
    public class TurnOverRepository : GeneralRepository<ProjectRasmanagementContext, TurnOver, int>
    {
        private readonly ProjectRasmanagementContext context;

        public TurnOverRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Object>> GetTurnOverEmployee()
        {
            var query = from turnOver in context.TurnOvers
                        join account in context.Accounts on turnOver.AccountId equals account.AccountId
                        join department in context.Departments on turnOver.DeptId equals department.DeptId
                        select new
                        {
                            turnOver.TurnOverId,
                            turnOver.Status,
                            turnOver.ExitDate,
                            turnOver.Description,
                            turnOver.AccountId,
                     
                            account.Fullname,
                            account.Email,
                            account.Address,
                            account.Gender,
                            department.NamaDept // Ambil kolom nama departemen dari tabel Departments
                        };
            return query.ToList();


        }

    }
}
