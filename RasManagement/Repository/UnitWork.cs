using RasManagement.Interface;

namespace RasManagement.Repository
{
    public class UnitWork : IUnitWork
    {
        private readonly ProjectRasmanagementContext _context;

        public UnitWork(ProjectRasmanagementContext context)
        {
           _context = context;
            Account = new AccountRepository(_context);
        }
        public IAccount Account { get; private set; }
        public int Save()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
