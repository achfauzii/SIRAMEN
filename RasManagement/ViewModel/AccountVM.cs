﻿namespace RasManagement.ViewModel
{
    public class AccountVM
    {
        public string AccountId { get; set; } = null!;

        public string? NIK { get; set; }

        public string? Position { get; set; }

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

        public DateTime? JoinDate { get; set; }

        public DateTime? StartContract { get; set; }

        public DateTime? EndContract { get; set; }

        public string? Image { get; set; }

        public bool? IsChangePassword { get; set; }

        public string? RoleId { get; set; }
        public string? Level { get; set; }
        public string? FinancialIndustry { get; set; }
    }


    public class FilterEmpVM
    {
        public string AccountId { get; set; } = null!;
        public DateTime? JoinDate { get; set; }
        public string? RoleId { get; set; }
        
    }

}
