using System;
using System.Collections.Generic;

using System.Text.Json.Serialization;


namespace RasManagement.Models;

public partial class Department
{
    public int DeptId { get; set; }

    public string NamaDept { get; set; } = null!;


    [JsonIgnore]
    public virtual ICollection<TurnOver>? TurnOvers { get; set; } = new List<TurnOver>();

}
