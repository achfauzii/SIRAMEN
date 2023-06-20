using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RasManagement.Models
{
    [Table("Qualification")]
    public class Qualification
    {
        [Key]
        public int Qualification_Id { get; set; }
        public string Framework { get; set; }
        public string Programming_language { get; set; }
        public string Database { get; set; }
        public string Tools { get; set; }
        public string Others { get; set; }

        public virtual Role? Role { get; set; }
    }
}
