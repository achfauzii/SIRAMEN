
using Microsoft.EntityFrameworkCore;
using RasManagement.ViewModel;

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
                        join department in context.Departments on turnOver.DeptId equals department.DeptId into deptGroup
                        from dept in deptGroup.DefaultIfEmpty() // Ini adalah left join
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
                            DeptName = dept != null ? dept.NamaDept : null // Ambil nama departemen jika dept tidak null, atau null jika dept null
                        };
            return query.ToList();


        }

        public async Task<IEnumerable<HiredStatusVM>> GetStatusHiredEmp()
        {
            var statusHired = await (from turnOver in context.TurnOvers
                                     join account in context.Accounts on turnOver.AccountId equals account.AccountId
                                     select new HiredStatusVM
                                     {
                                         AccountId = turnOver.AccountId,
                                         Status = turnOver.Status,
                                         JoinDate = account.JoinDate
                                     }).ToListAsync();

            return statusHired;
        }


        


    }
}
