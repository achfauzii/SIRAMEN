namespace RasManagement.Repository
{
    public class DepartmentRepository : GeneralRepository<ProjectRasmanagementContext, Department, int>
    {
        private readonly ProjectRasmanagementContext context;

        public DepartmentRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<bool> DepartmentIsExist(string name)
        {
            // Use AnyAsync to check if any department with the given name exists
            var departmentExists = await context.Departments.AnyAsync(a => a.NamaDept == name);

            return departmentExists;
        }

        public async Task<Department> AddDepartment(string name)
        {
            // Assuming you have a Department model and DbSet<Department> in your context
            var newDepartment = new Department { NamaDept = name };

            // Add the new department to the context and save changes
            context.Departments.Add(newDepartment);
            await context.SaveChangesAsync();

            return newDepartment;
        }
        }
}
