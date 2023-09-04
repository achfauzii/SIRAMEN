namespace RasManagement.Models
{
    public class DataTablesResponse
    {
        public int Draw { get; set; }
        public int RecordsTotal { get; set; }
        public int RecordsFiltered { get; set; }
        public IEnumerable<object> Data { get; set; }
    }
}
