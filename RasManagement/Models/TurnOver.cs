using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class TurnOver
{
    public int TurnOverId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime ExitDate { get; set; }

    public string? Description { get; set; }

    public string AccountId { get; set; } = null!;

    public int? DeptId { get; set; }
    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;

    public virtual Department? Dept { get; set; }
}
