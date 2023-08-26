namespace RasManagement.Interface
{
    public interface GenericInterface<T> where T : class
    {
        //T GetById(string email, string password);
        //T GetValue(object view);
        IEnumerable<T> GetAll();
        int Insert(Account account);
        int Update(Account account);


    }
}
