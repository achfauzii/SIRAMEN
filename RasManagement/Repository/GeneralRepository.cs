using Microsoft.EntityFrameworkCore;
using RasManagement.Interface;

namespace RasManagement.Repository
{
    public class GeneralRepository<Context, Entity, Key> : GeneralInterface<Entity, Key>
        where Entity : class
        where Context : ProjectRasmanagementContext
    {
        private readonly ProjectRasmanagementContext context;
        private readonly DbSet<Entity> entities;

        public GeneralRepository(ProjectRasmanagementContext context)
        {
            this.context = context;
            entities = context.Set<Entity>();
        }

        public int Delete(Key key)
        {
            var findKey = entities.Find(key);
            if (findKey != null)
            {
                entities.Remove(findKey);
                return context.SaveChanges();
            }
            return 404;
        }

        public IEnumerable<Entity> Get()
        {
            return entities.ToList();
        }



        public Entity get(Key key)
        {
            return entities.Find(key);
        }

        public virtual int Insert(Entity entity)
        {
            entities.Add(entity);
            var insert = context.SaveChanges();
            return insert;
        }

        public int Update(Entity entity)
        {
            context.Entry(entity).State = EntityState.Modified;
            return context.SaveChanges();
        }

        public class CheckValidation
        {
            public const Account[] NullPounterAccount = null;
            public const Account NullPointerAnAccount = null;
            public const Account PasswordNotPassed = null;
        }
    }
}