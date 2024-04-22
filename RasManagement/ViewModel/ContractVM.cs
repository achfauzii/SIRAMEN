namespace RasManagement.ViewModel
{
    public class ContractVM
    {
        public string AccountId { get; set; } = null!;
        public DateTime? StartContract { get; set; }

        public DateTime? EndContract { get; set; }
        public string? Position { get; set; }
    }
}
