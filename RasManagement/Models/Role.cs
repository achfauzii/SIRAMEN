using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RasManagement.Models
{

    [Table("Role")]
    public class Role
    {
        [Key]
        //[DatabaseGenerated(DatabaseGeneratedOption.None)] // set identity menjadi OFF
        public int Role_id { get; set; }
        public string? Role_name { get; set; }
    }
}
