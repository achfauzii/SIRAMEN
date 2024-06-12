using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RasManagement.Models;

public partial class ProjectRasmanagementContext : DbContext
{
    public ProjectRasmanagementContext()
    {
    }

    public ProjectRasmanagementContext(DbContextOptions<ProjectRasmanagementContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<AssetsManagement> AssetsManagements { get; set; }

    public virtual DbSet<Certificate> Certificates { get; set; }

    public virtual DbSet<ClientName> ClientNames { get; set; }

    public virtual DbSet<DataUniversita> DataUniversitas { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<EmploymentHistory> EmploymentHistories { get; set; }

    public virtual DbSet<FormalEdu> FormalEdus { get; set; }

    public virtual DbSet<HistoryLog> HistoryLogs { get; set; }

    public virtual DbSet<LastModified> LastModifieds { get; set; }

    public virtual DbSet<NonFormalEdu> NonFormalEdus { get; set; }

    public virtual DbSet<NonRasCandidate> NonRasCandidates { get; set; }

    public virtual DbSet<Placement> Placements { get; set; }

    public virtual DbSet<Position> Positions { get; set; }
    public virtual DbSet<SalesProjection> SalesProjections { get; set; }
    public virtual DbSet<ActivitySalesProjection> ActivitySalesProjections { get; set; }

    public virtual DbSet<ProjectHistory> ProjectHistories { get; set; }

    public virtual DbSet<Qualification> Qualifications { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<TimeSheet> TimeSheets { get; set; }

    public virtual DbSet<Approval> Approvals { get; set; }

    public virtual DbSet<MasterHoliday> MasterHolidays { get; set; }

    public virtual DbSet<TrackingInterview> TrackingInterviews { get; set; }

    public virtual DbSet<TurnOver> TurnOvers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

        //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        //=> optionsBuilder.UseSqlServer("server = RAS-FAUZI; Database = Project_RASManagement; user id = sa; password = 5aPassword; Encrypt = false; TrustServerCertificate=Yes; MultipleActiveResultSets=True;");
        //=> optionsBuilder.UseSqlServer("server = .\\SQLEXPRESS; Database = Project_RASManagement; user id = sa; password = b3rca!@#; Encrypt = false; TrustServerCertificate=Yes; MultipleActiveResultSets=True;");
        if (!optionsBuilder.IsConfigured)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json")
               .Build();
            var connectionString = configuration.GetSection("ConnectionStrings:ProjectRasmanagementContext").Value;
            optionsBuilder.UseSqlServer(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Account");

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Birthdate).HasColumnType("date");
            entity.Property(e => e.Birthplace)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EndContract)
                .HasColumnType("date")
                .HasColumnName("End_contract");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Hiredstatus)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Image)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.JoinDate)
                .HasColumnType("date")
                .HasColumnName("Join_date");
            entity.Property(e => e.Maritalstatus)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Nationality)
                .HasMaxLength(4)
                .IsUnicode(false);
            entity.Property(e => e.Nickname)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.NIK)
                .HasMaxLength(6)
                .IsUnicode(false)
                .HasColumnName("NIK");
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.Position)
                .IsUnicode(false);
            entity.Property(e => e.Religion)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.RoleId)
                .HasMaxLength(4)
                .IsUnicode(false)
                .HasColumnName("Role_Id");
            entity.Property(e => e.StartContract)
                .HasColumnType("date")
                .HasColumnName("Start_contract");
            entity.Property(e => e.Level)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.FinancialIndustry)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Financial_Industry");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK_Account_Role");
        });

        modelBuilder.Entity<AssetsManagement>(entity =>
        {
            entity.HasKey(e => e.AssetsManagementId).HasName("PK__AssetsMa__1AD8D05B51F60BDA");

            entity.ToTable("AssetsManagement");

            entity.Property(e => e.AssetsManagementId).HasColumnName("AssetsManagement_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.DateObtained).HasColumnType("date");
            entity.Property(e => e.Display).IsUnicode(false);
            entity.Property(e => e.GraphicCard)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Hdd)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("HDD");
            entity.Property(e => e.Nama).IsUnicode(false);
            entity.Property(e => e.OperatingSystem).IsUnicode(false);
            entity.Property(e => e.Processor).IsUnicode(false);
            entity.Property(e => e.Ram)
                .IsUnicode(false)
                .HasColumnName("RAM");
            entity.Property(e => e.Rfid)
                .IsUnicode(false)
                .HasColumnName("RFID");
            entity.Property(e => e.Ssd)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("SSD");

            entity.HasOne(d => d.Account).WithMany(p => p.AssetsManagements)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Account");
        });

        modelBuilder.Entity<Certificate>(entity =>
        {
            entity.ToTable("Certificate");

            entity.Property(e => e.CertificateId).HasColumnName("Certificate_id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PublicationYear)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Publication_year");
            entity.Property(e => e.Publisher)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ValidUntil)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Valid_until");

            entity.HasOne(d => d.Account).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Certificate_Account");
        });

        modelBuilder.Entity<ClientName>(entity =>
        {
            entity.ToTable("Client_Name");

            entity.Property(e => e.NameOfClient)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SalesName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SalesContact)
            .HasMaxLength(50)
            .IsUnicode(false);
            entity.Property(e => e.ClientContact)
          .HasMaxLength(50);
            entity.Property(e => e.PicClient)
          .HasMaxLength(50)
          .IsUnicode(false);
            entity.Property(e => e.CompanyOrigin)
             .HasMaxLength(50)
             .IsUnicode(false);
            entity.Property(e => e.Authority)
                 .HasMaxLength(50)
                 .IsUnicode(false);
            entity.Property(e => e.Industry)
             .HasMaxLength(255)
             .IsUnicode(false);

        });

        modelBuilder.Entity<DataUniversita>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Data_uni__3213E83F19FE3B0C");

            entity.ToTable("Data_universitas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NamaUniversitas)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nama_universitas");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DeptId);

            entity.ToTable("Department");

            entity.HasIndex(e => e.DeptId, "IX_Department");

            entity.Property(e => e.DeptId).HasColumnName("Dept_Id");
            entity.Property(e => e.NamaDept)
                .IsUnicode(false)
                .HasColumnName("Nama_Dept");
        });

        modelBuilder.Entity<EmploymentHistory>(entity =>
        {
            entity.HasKey(e => e.WorkExperienceId);

            entity.ToTable("Employment_History");

            entity.Property(e => e.WorkExperienceId).HasColumnName("Work_experience_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Job)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Period)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.EmploymentHistories)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Employment_History_Account");
        });

        modelBuilder.Entity<FormalEdu>(entity =>
        {
            entity.ToTable("Formal_Edu");

            entity.Property(e => e.FormalEduId).HasColumnName("FormalEdu_id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Degree)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Location)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Major)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UniversityName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Years)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Ipk)
                .HasMaxLength(5)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.FormalEdus)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Formal_Edu_Account");
        });

        modelBuilder.Entity<HistoryLog>(entity =>
        {
            entity.ToTable("History_Log");

            entity.Property(e => e.AccountId).IsUnicode(false);
            entity.Property(e => e.Activity).IsUnicode(false);
            entity.Property(e => e.Name).IsUnicode(false);
            entity.Property(e => e.TimeStamp)
                .HasColumnType("datetime")
                .HasColumnName("Time_Stamp");
        });

        modelBuilder.Entity<LastModified>(entity =>
        {
            entity.ToTable("Last_Modified");

            entity.Property(e => e.LastModifiedId).HasColumnName("Last_Modified_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.LastModifiedShortList)
                .HasColumnType("date")
                .HasColumnName("LastModified_ShortList");

            entity.HasOne(d => d.Account).WithMany(p => p.LastModifieds)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Last_Modified_Account");
        });

        modelBuilder.Entity<NonFormalEdu>(entity =>
        {
            entity.HasKey(e => e.NonFormalId);

            entity.ToTable("NonFormal_Edu");

            entity.Property(e => e.NonFormalId).HasColumnName("NonFormal_id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Name).IsUnicode(false);
            entity.Property(e => e.Organizer).IsUnicode(false);
            entity.Property(e => e.Years)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.NonFormalEdus)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NonFormal_Edu_Account");
        });

        modelBuilder.Entity<NonRasCandidate>(entity =>
        {
            entity.HasKey(e => e.NonRasId);

            entity.ToTable("NonRAS_Candidate");

            entity.Property(e => e.NonRasId).HasColumnName("NonRAS_Id");
            entity.Property(e => e.Birthdate)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.CurrentSalary)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Current_Salary");
            entity.Property(e => e.CvBerca)
                .IsUnicode(false)
                .HasColumnName("CV_Berca");
            entity.Property(e => e.Domisili)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Education)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EnglishLevel)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("English_Level");
            entity.Property(e => e.ExpectedSalary)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Expected_Salary");
            entity.Property(e => e.ExperienceInYear)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Experience_In_Year");
            entity.Property(e => e.FilteringBy)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Filtering_By");
            entity.Property(e => e.FinancialIndustry)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Financial_Industry");
            entity.Property(e => e.Fullname)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IntwByRas)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Intw_ByRAS");
            entity.Property(e => e.IntwDateByRas)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IntwDate_ByRAS");
            entity.Property(e => e.Ipk)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.LastModified)
                .HasColumnType("date")
                .HasColumnName("Last_Modified");
            entity.Property(e => e.Level)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.LevelRekom)
                .HasMaxLength(8)
                .IsUnicode(false)
                .HasColumnName("Level_Rekom");
            entity.Property(e => e.Negotiable)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.NoticePeriode)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Notice_Periode");
            entity.Property(e => e.Position)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RawCv)
                .IsUnicode(false)
                .HasColumnName("Raw_CV");
            entity.Property(e => e.Skillset).IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.TechTest)
                .IsUnicode(false)
                .HasColumnName("Tech_Test");
            entity.Property(e => e.University)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.WorkStatus)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Work_Status");
            entity.Property(e => e.isDeleted)
                .IsUnicode(false);
            /*entity.Property(e => e.Client_Id).HasColumnName("Client_Id");*/

            /*   entity.HasOne(d => d.Client).WithMany(e => e.NonRasCandidates)
                   .HasForeignKey(d => d.Client_Id)
                   .HasConstraintName("FK_NonRas_Client");*/
        });

        modelBuilder.Entity<Placement>(entity =>
        {
            entity.HasKey(e => e.PlacementStatusId);

            entity.ToTable("Placement");

            entity.Property(e => e.PlacementStatusId).HasColumnName("Placement_status_id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.ClientId).HasColumnName("Client_Id");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnType("date");
            entity.Property(e => e.PositionId).HasColumnName("Position_Id");
            entity.Property(e => e.PicName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PIC");
            entity.Property(e => e.PicRas)
               .HasMaxLength(50)
               .IsUnicode(false)
               .HasColumnName("PIC_Ras");
            entity.Property(e => e.PlacementStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Placement_status");
            entity.Property(e => e.StartDate).HasColumnType("date");

            entity.HasOne(d => d.Account).WithMany(p => p.Placements)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Placement_Account");

            entity.HasOne(d => d.Client).WithMany(p => p.Placements)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_Placement_Client");

            entity.HasOne(d => d.Position).WithMany(p => p.Placements)
                .HasForeignKey(d => d.PositionId)
                .HasConstraintName("FK_Placement_Position");
        });

        modelBuilder.Entity<Position>(entity =>
        {
            entity.ToTable("Position");

            //entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.ClientId).HasColumnName("Client_Id");
            entity.Property(e => e.Level)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.PositionClient)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Position");
            entity.Property(e => e.SkillSet)
               .HasColumnType("VARCHAR(MAX)")
              .IsUnicode(false);
          
            entity.Property(e => e.Quantity)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Client).WithMany(p => p.Positions)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_Position_Client");

            entity.HasOne(d => d.SalesProjection).WithMany(p => p.Positions)
          .HasForeignKey(d => d.SP_Id)
          .HasConstraintName("FK_Position_Sales_Projection");
        });

        modelBuilder.Entity<SalesProjection>(entity =>
        {
            entity.ToTable("Sales_Projection");

            entity.Property(e => e.EntryDate).HasColumnType("date");

            entity.Property(e => e.ProjectStatus)
                .HasMaxLength(20)
                .IsUnicode(false);

            entity.Property(e => e.Attendees)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.Property(e => e.RequestBy)
                .HasMaxLength(50)
                .IsUnicode(false);


            entity.Property(e => e.HiringNeeds)
               .HasColumnType("VARCHAR(MAX)")
                .IsUnicode(false);

            entity.Property(e => e.Timeline)
               .HasMaxLength(100)
               .IsUnicode(false);

            entity.Property(e => e.HiringProcess)
             .HasMaxLength(50)
             .IsUnicode(false);

            entity.Property(e => e.WorkLocation)
           .HasMaxLength(200)
           .IsUnicode(false);

            entity.Property(e => e.Notes)
           .HasMaxLength(255)
           .IsUnicode(false);

            entity.Property(e => e.Priority)
              .HasMaxLength(10)
              .IsUnicode(false);

            entity.Property(e => e.Status)
              .HasMaxLength(20)
              .IsUnicode(false);

            entity.Property(e => e.ContractPeriode)
              .HasMaxLength(50)
              .IsUnicode(false);

            entity.Property(e => e.RateCard)
        .HasColumnType("VARCHAR(MAX)")
           .IsUnicode(false);

            entity.Property(e => e.CurrentNews)
              .HasColumnType("VARCHAR(MAX)")
              .IsUnicode(false);

            entity.Property(e => e.ProjectType)
           .HasMaxLength(50)
           .IsUnicode(false);

            entity.Property(e => e.StartedYear)
           .HasMaxLength(50)
           .IsUnicode(false);

            entity.Property(e => e.SalesProject)
            .HasColumnName("SalesProjection")
            .IsUnicode(false);

            entity.Property(e => e.COGS)
            .IsUnicode(false);

            entity.Property(e => e.GPM)
          .IsUnicode(false);

            entity.Property(e => e.SoNumber)
             .IsUnicode(false);

            entity.Property(e => e.LastUpdate)
           .HasColumnType("VARCHAR(MAX)")
              .IsUnicode(false);


            entity.HasOne(d => d.Client).WithMany(p => p.SalesProjections)
            .HasForeignKey(d => d.ClientId)
            .HasConstraintName("FK_Sales_Projection_Client_Name");


        });

        modelBuilder.Entity<ActivitySalesProjection>(entity =>
        {
            entity.ToTable("Activity_Sales_Projection");

            entity.Property(e => e.SPId).HasColumnName("SP_Id");

            entity.Property(e => e.Activity)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.Property(e => e.Date).HasColumnType("date");


            entity.HasOne(d => d.Sales).WithMany(p => p.ActivitySalesProjections)
            .HasForeignKey(d => d.SPId)
            .HasConstraintName("FK_Activity_Sales_Projection_Activity_Sales_Projection");


        });

        modelBuilder.Entity<ProjectHistory>(entity =>
        {
            entity.ToTable("Project_History");

            entity.Property(e => e.ProjectHistoryId).HasColumnName("Project_history_id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.CompanyName)
                .IsUnicode(false)
                .HasColumnName("Company_name");
            entity.Property(e => e.JobSpec)
                .IsUnicode(false)
                .HasColumnName("Job_spec");
            entity.Property(e => e.ProjectName)
                .IsUnicode(false)
                .HasColumnName("Project_name");
            entity.Property(e => e.Year)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.ProjectHistories)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Project_History_Account");
        });

        modelBuilder.Entity<Qualification>(entity =>
        {
            entity.ToTable("Qualification");

            entity.Property(e => e.QualificationId).HasColumnName("Qualification_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Database).IsUnicode(false);
            entity.Property(e => e.Others).IsUnicode(false);
            entity.Property(e => e.ProgrammingLanguage)
                .IsUnicode(false)
                .HasColumnName("Programming_language");
            entity.Property(e => e.Tools).IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.Qualifications)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Qualification_Account");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.RoleId)
                .HasMaxLength(4)
                .IsUnicode(false)
                .HasColumnName("Role_Id");
            entity.Property(e => e.Rolename)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<TimeSheet>(entity =>
        {
            entity.ToTable("Time_Sheet");

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Activity).IsUnicode(false);
            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.Flag)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.KnownBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Known_by");
            entity.Property(e => e.PlacementStatusId).HasColumnName("Placement_status_id");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.TimeSheets)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Time_Sheet_Account");

            entity.HasOne(d => d.PlacementStatus).WithMany(p => p.TimeSheets)
                .HasForeignKey(d => d.PlacementStatusId)
                .HasConstraintName("FK_Time_Sheet_Placement");
        });

        modelBuilder.Entity<Approval>(entity =>
        {
            entity.ToTable("Approval");

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Activity).IsUnicode(false);
            entity.Property(e => e.Category)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.Flag)
                .HasMaxLength(25)
                .IsUnicode(false);
            entity.Property(e => e.KnownBy)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Known_by");
            entity.Property(e => e.StatusApproval)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Status_approval");
            entity.Property(e => e.PlacementStatusId).HasColumnName("Placement_status_id");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Notes)
             .HasMaxLength(255)
             .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Approval_Account");

            entity.HasOne(d => d.PlacementStatus).WithMany(p => p.Approvals)
                .HasForeignKey(d => d.PlacementStatusId)
                .HasConstraintName("FK_Approval_Placement");
        });

        modelBuilder.Entity<MasterHoliday>(entity =>
        {
            entity.HasKey(e => e.Holiday_Id);
            entity.ToTable("MasterHoliday");

            /* entity.Property(e => e.AccountId)
                 .HasMaxLength(50)
                 .IsUnicode(false)
                 .HasColumnName("Account_Id");*/
            entity.Property(e => e.Name).IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("date");
            entity.Property(e => e.Description).IsUnicode(false);

            /*entity.HasOne(d => d.Account).WithMany(p => p.MasterHolidays)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_MasterHoliday_Account");*/
        });

        modelBuilder.Entity<TrackingInterview>(entity =>
        {
            entity.ToTable("Tracking_interview");

            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.ClientId).HasColumnName("Client_Id");
            entity.Property(e => e.IntvwDate)
                .IsUnicode(false)
                .HasColumnName("Intvw_date");
            entity.Property(e => e.IntvwStatus)
                .IsUnicode(false)
                .HasColumnName("Intvw_status");
            entity.Property(e => e.NonRasId).HasColumnName("NonRAS_Id");
            entity.Property(e => e.Notes).IsUnicode(false);
            entity.Property(e => e.PositionId).HasColumnName("Position_Id");

            entity.HasOne(d => d.Account).WithMany(p => p.TrackingInterviews)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Tracking_interview_Account");

            entity.HasOne(d => d.Client).WithMany(p => p.TrackingInterviews)
                .HasForeignKey(d => d.ClientId)
                .HasConstraintName("FK_Tracking_interview_Client");

            entity.HasOne(d => d.NonRas).WithMany(p => p.TrackingInterviews)
                .HasForeignKey(d => d.NonRasId)
                .HasConstraintName("FK_Tracking_interview_NonRAS_Candidate");

            entity.HasOne(d => d.Position).WithMany(p => p.TrackingInterviews)
                .HasForeignKey(d => d.PositionId)
                .HasConstraintName("FK_Tracking_interview_Position");
        });

        modelBuilder.Entity<TurnOver>(entity =>
        {
            entity.ToTable("TurnOver");

            entity.Property(e => e.TurnOverId).HasColumnName("TurnOver_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
            entity.Property(e => e.DeptId).HasColumnName("Dept_Id");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.ExitDate)
                .HasColumnType("date")
                .HasColumnName("Exit_date");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.TurnOvers)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TurnOver_Account");

            entity.HasOne(d => d.Dept).WithMany(p => p.TurnOvers)
                .HasForeignKey(d => d.DeptId)
                .HasConstraintName("FK_TurnOver_Department");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
