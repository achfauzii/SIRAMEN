namespace RasManagement.ViewModel
{
    public class CandidateVM
    {
        public string AccountId { get; set; } = null!;
        public string Fullname { get; set; } = null!;
        public DateTime? Birthdate { get; set; }
        public string Degree { get; set; } = null!;
    }
}
