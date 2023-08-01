﻿using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class Account
{
    public string AccountId { get; set; } = null!;

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Nickname { get; set; }

    public string? Fullname { get; set; }

    public string? Birthplace { get; set; }

    public DateTime? Birthdate { get; set; }

    public string? Religion { get; set; }

    public string? Gender { get; set; }

    public string? Maritalstatus { get; set; }

    public string? Hiredstatus { get; set; }

    public string? Nationality { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Image { get; set; }

    public string? RoleId { get; set; }

    public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

    public virtual ICollection<EmploymentHistory> EmploymentHistories { get; set; } = new List<EmploymentHistory>();

    public virtual ICollection<FormalEdu> FormalEdus { get; set; } = new List<FormalEdu>();

    public virtual ICollection<NonFormalEdu> NonFormalEdus { get; set; } = new List<NonFormalEdu>();

    public virtual ICollection<Placement> Placements { get; set; } = new List<Placement>();

    public virtual ICollection<ProjectHistory> ProjectHistories { get; set; } = new List<ProjectHistory>();

    public virtual ICollection<Qualification> Qualifications { get; set; } = new List<Qualification>();

    public virtual Role? Role { get; set; }
}