using System.Text.Json.Serialization;

namespace RasManagement.Models
{
    public class ActivitySalesProjection
    {
        public int Id { get; set; } 

        public int SPId  { get; set; }

        public string ? Activity { get; set; } = null;
        public DateTime ? Date { get; set; } = null;

        [JsonIgnore]
        public virtual SalesProjection? Sales { get; set; }


    }
}
