using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RasManagement.Models
{
    [Table("Job_vacancy")]
    public class Job_vacancy
    {
        [Key]
        public string JobVacancy_Id { get; set; }

    }
}
