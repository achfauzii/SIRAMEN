namespace RasManagement.Repository
{
    public class DepartmentRepository : GeneralRepository<ProjectRasmanagementContext, Department, int>
    {
        private readonly ProjectRasmanagementContext context;

        public DepartmentRepository(ProjectRasmanagementContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<bool> DepartmentIsExist(string name, int? id = null)
{
             var departmentExists = await context.Departments
        .AnyAsync(a => a.NamaDept == name && (id == null || a.DeptId != id));

        return departmentExists;
        }

        public async Task<Department> UpdateDepartment(int id, string newName)
        {
            var departmentToUpdate = await context.Departments.FindAsync(id);
            if (departmentToUpdate == null)
            {
                return null;
            }
            departmentToUpdate.NamaDept = newName;
            await context.SaveChangesAsync();
            return departmentToUpdate;
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
