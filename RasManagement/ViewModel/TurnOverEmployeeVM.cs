namespace RasManagement.ViewModel
{
    public class TurnOverEmployeeVM
    {
        public string AccountId { get; set; } = null!;
        public string Name{ get; set; } = null!;
        public string Email { get; set; }
        public string Gender{ get; set; } = null!;
        public string Adress { get; set; } = null!;
        public string Status { get; set; } = null!;
        public string HiriedStatus { get; set; } = null!;
        public DateTime? ExitDate{ get; set; }
        public string Description { get; set; } = null!;
    }
}
