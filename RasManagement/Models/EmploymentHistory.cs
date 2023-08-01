﻿using System;
using System.Collections.Generic;

namespace RasManagement.Models;

public partial class EmploymentHistory
{
    public int WorkExperienceId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string Job { get; set; } = null!;

    public string Period { get; set; } = null!;

    public string Description { get; set; } = null!;


    public string AccountId { get; set; } = null!;
}
