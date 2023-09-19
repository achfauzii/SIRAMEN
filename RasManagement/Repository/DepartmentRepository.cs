namespace RasManagement.Repository
{
    public class DepartmentRepository : GeneralRepository<ProjectRasmanagementContext, Department, int>
    {
        private readonly ProjectRasmanagementContext context;

        public DepartmentRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
    }
}
