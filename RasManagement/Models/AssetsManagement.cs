using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace RasManagement.Models;

public partial class AssetsManagement
{
    public int AssetsManagementId { get; set; }

    public string Rfid { get; set; } = null!;

    public string Nama { get; set; } = null!;

    public string? Processor { get; set; }

    public string? Display { get; set; }

    public string? OperatingSystem { get; set; }

    public string? Ram { get; set; }

    public string? Ssd { get; set; }

    public string? Hdd { get; set; }

    public string? GraphicCard { get; set; }

    public bool? Charger { get; set; }

    public string AccountId { get; set; } = null!;
    [JsonIgnore]
    public virtual Account? Account { get; set; } = null!;
}