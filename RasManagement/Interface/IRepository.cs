namespace RasManagement.Interface
{
    public interface IRepository<Entity, Key> where Entity : class
    {
        public IEnumerable<Entity> Get();
        //public IEnumerable<University> Get();
        public Entity Get(Key key);
        //public University Get(string Id);
        //public University Get(int Id);
        public int Insert(Entity entity);
        //public int Insert(University university);
        public int Update(Entity entity);
        public int Delete(Key key);
    }
}
