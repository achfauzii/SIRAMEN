using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Role
{
    public string RoleId { get; set; } = null!;

    public string Rolename { get; set; } = null!;

    public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
