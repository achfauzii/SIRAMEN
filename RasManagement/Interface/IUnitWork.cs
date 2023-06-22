namespace RasManagement.Interface
{
    public interface IUnitWork : IDisposable
    {
        IAccount Account { get; }
        int Save();
    }
}
