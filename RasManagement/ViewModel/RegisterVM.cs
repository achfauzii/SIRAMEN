namespace RasManagement.ViewModel
{
    public class RegisterVM
    {
        public string AccountId { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public DateTime? JoinDate { get; set; }

        public DateTime? StartContract { get; set; }

        public DateTime? EndContract { get; set; }

        public string Fullname { get; set; } = null!;

        public string? Hiredstatus { get; set; }

        public string Gender { get; set; }

        public string RoleId { get; set; } = null!;


    }
}
