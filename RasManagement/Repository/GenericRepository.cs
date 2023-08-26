using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;

namespace RasManagement.Repository
{
    public class GenericRepository<T> : GenericInterface<T> where T : class
    {
        private readonly ProjectRasmanagementContext _context;

        public GenericRepository(ProjectRasmanagementContext context)
        {
            _context = context;
        }
        public IEnumerable<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public int Insert(Account Account)
        {
            throw new NotImplementedException();
        }

        public int Update(Account account)
        {
            throw new NotImplementedException();
        }
        public class CheckValidation
        {
            public const Account[] NullPounterAccount = null;
            public const Account NullPointerAnAccount = null;
            public const Account PasswordNotPassed = null;
        }
    }
}
