namespace FrontEnd_RasManagement.Models
{
    public class EmployeeViewModel
    {
        public string AccountId { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Nickname { get; set; }

        public string Fullname { get; set; } = null!;

        public string? Birthplace { get; set; }

        public DateTime? Birthdate { get; set; }

        public string? Religion { get; set; }

        public string? Gender { get; set; }

        public string? Maritalstatus { get; set; }

        public string? Hiredstatus { get; set; }

        public string? Nationality { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string? Image { get; set; }

        public string RoleId { get; set; } = null!;
    }
}
