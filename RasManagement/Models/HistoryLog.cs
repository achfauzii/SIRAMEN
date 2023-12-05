using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class HistoryLog
{
    public int Id { get; set; }

    public string? AccountId { get; set; }

    public string? Name { get; set; }

    public string? Activity { get; set; }

    public DateTime? TimeStamp { get; set; }
}
