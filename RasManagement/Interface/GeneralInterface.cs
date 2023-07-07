namespace RasManagement.Interface
{
    public interface GeneralInterface<Entity, Key> where Entity : class
    {
        public IEnumerable<Entity> Get();
        public Entity get(Key key);
        public int Insert(Entity entity);
        public int Update(Entity entity);
        int Delete(Key key);

    }
}