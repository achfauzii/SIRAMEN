using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class LastModified
{
    public int LastModifiedId { get; set; }

    public string? AccountId { get; set; }

    public DateTime? LastModifiedShortList { get; set; }

    public virtual Account? Account { get; set; }
}
