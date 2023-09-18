using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Department
{
    public int DeptId { get; set; }

    public string NamaDept { get; set; } = null!;

    public virtual ICollection<TurnOver> TurnOvers { get; set; } = new List<TurnOver>();
}
