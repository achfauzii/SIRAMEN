using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class ProjectHistory
{
    public int ProjectHistoryId { get; set; }

    public string ProjectName { get; set; } = null!;

    public string JobSpec { get; set; } = null!;

    public string Year { get; set; } = null!;

    public string CompanyName { get; set; } = null!;

    public string AccountId { get; set; } = null!;
    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;
}
