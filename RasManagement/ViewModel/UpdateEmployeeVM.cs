namespace RasManagement.ViewModel
{
    public class UpdateEmployeeVM
    {
        public string AccountId { get; set; } = null!;
        public string? Fullname { get; set; }
        public string? Nickname { get; set; }
        public string? Birthplace { get; set; }
        public DateTime? Birthdate { get; set; }
        public string? Gender { get; set; }
        public string? Religion { get; set; }
        public string? Maritalstatus { get; set; }
        public string? Nationality { get; set; }
        public string? Image { get; set; }
    }
}