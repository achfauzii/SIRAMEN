using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;
using System.Text.Json.Serialization;

namespace RasManagement.Models
{
    [Table("RASProject_Account")]
    public class Account
    {
        [Key]
        public int Account_Id { get; set; }
        public string Fullname { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; } 
        public string Password { get; set }
        public string Place_of_birth { get; set; }
        public DateTimeOffset Date_of_birth { get; set; }
        public string Religion { get; set; }
        public Gender Gender { get; set; }
        public string Marital_status { get; set; }
        public string Nationality { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Photo { get; set; }
        public virtual Role? Role { get; set; }
    }
    public enum Gender
    {
        Male,
        Female
    }
}

