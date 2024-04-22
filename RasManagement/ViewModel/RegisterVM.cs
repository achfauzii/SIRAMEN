using System.ComponentModel.DataAnnotations;

namespace RasManagement.ViewModel
{
    public class RegisterVM
    {
        public string AccountId { get; set; } = null!;
        [MaxLength(6)]
        public string NIK { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? Position { get; set; }

        public DateTime? JoinDate { get; set; }

        public DateTime? StartContract { get; set; }

        public DateTime? EndContract { get; set; }

        public string Fullname { get; set; } = null!;

        public string? Hiredstatus { get; set; }

        public string Gender { get; set; }

        public string RoleId { get; set; } = null!;
        
        public string? Level { get; set; }
        public string? FinancialIndustry { get; set; }


    }
}
