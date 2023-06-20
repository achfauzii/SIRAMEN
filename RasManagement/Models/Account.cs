using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RasManagement.Models
{
    [Table("RASProject_Account")]
    public class Account
    {
        [Key]
        public string Account_Id { get; set; }
        public string Fullname { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set }
        public string Birthplace { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

    }
}

