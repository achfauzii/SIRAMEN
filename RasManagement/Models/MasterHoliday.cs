

using System.Text.Json.Serialization;

namespace RasManagement.Models
{
    public class MasterHoliday
    {
        public int Holiday_Id { get; set; }
        public string? Name { get; set; }
        public DateTime? Date { get; set; }
        public string? Description { get; set; }
        /*public string? AccountId { get; set; } = null!;

        [JsonIgnore]
        public virtual Account? Account { get; set; } = null!;*/
    }
}
