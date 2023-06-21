using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//using System.Reflection.Metadata;
//using System.Text.Json.Serialization;

namespace RasManagement.Models
{
    [Table("RASProject_Account")]
    public class Account
    {
        [Key]
        public string Account_Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

    }

}

