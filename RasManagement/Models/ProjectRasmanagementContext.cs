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

    public virtual DbSet<DataUniversita> DataUniversitas { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<EmploymentHistory> EmploymentHistories { get; set; }

    public virtual DbSet<FormalEdu> FormalEdus { get; set; }

    public virtual DbSet<LastModified> LastModifieds { get; set; }

    public virtual DbSet<NonFormalEdu> NonFormalEdus { get; set; }

    public virtual DbSet<NonRasCandidate> NonRasCandidates { get; set; }

    public virtual DbSet<OfferCandidate> OfferCandidates { get; set; }

    public virtual DbSet<Placement> Placements { get; set; }

    public virtual DbSet<ProjectHistory> ProjectHistories { get; set; }

    public virtual DbSet<Qualification> Qualifications { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<ShortlistCandidate> ShortlistCandidates { get; set; }

    public virtual DbSet<TurnOver> TurnOvers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server = RAS-FAYYAD; Database = Project_RASManagement; user id = sa; password = sapassword; Encrypt = false; TrustServerCertificate=Yes; MultipleActiveResultSets=True;");

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
            entity.Property(e => e.Password)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Phone)
                .HasMaxLength(15)
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
            entity.Property(e => e.IsChangePassword)
                .HasColumnName("IsChangePassword")
                .HasColumnType("bit")
                .HasDefaultValue(false);
            entity.Property(e => e.NIK)
                .HasMaxLength(6)
                .HasColumnName("NIK");
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
                .IsUnicode(false);
            entity.Property(e => e.PublicationYear)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Publication_year");
            entity.Property(e => e.Publisher)
                .HasMaxLength(100)
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
                .HasMaxLength(100)
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
                .IsUnicode(false);
            entity.Property(e => e.Years)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.FormalEdus)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Formal_Edu_Account");
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
            entity.Property(e => e.Name)
                .IsUnicode(false);
            entity.Property(e => e.Organizer)
                .HasMaxLength(100)
                .IsUnicode(false);
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

            entity.Property(e => e.NonRasId)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("NonRAS_Id");
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
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IntwByRas)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Intw_ByRAS");
            entity.Property(e => e.IntwDateByRas)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("IntwDate_ByRAS");
            entity.Property(e => e.IntwDateUser)
                .IsUnicode(false)
                .HasColumnName("IntwDate_User");
            entity.Property(e => e.IntwUser)
                .IsUnicode(false)
                .HasColumnName("Intw_User");
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
            entity.Property(e => e.NameOfUser)
                .IsUnicode(false)
                .HasColumnName("NameOf_User");
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
            entity.Property(e => e.University)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.WorkStatus)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Work_Status");
        });

        modelBuilder.Entity<OfferCandidate>(entity =>
        {
            entity.ToTable("Offer_Candidate");

            entity.Property(e => e.OfferCandidateId).HasColumnName("OfferCandidate_Id");
            entity.Property(e => e.IntwDateUser)
                .HasColumnType("date")
                .HasColumnName("IntwDate_User");
            entity.Property(e => e.IntwUser)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Intw_User");
            entity.Property(e => e.NameOfUser)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NameOf_User");
            entity.Property(e => e.ShortlistId).HasColumnName("Shortlist_Id");

            entity.HasOne(d => d.Shortlist).WithMany(p => p.OfferCandidates)
                .HasForeignKey(d => d.ShortlistId)
                .HasConstraintName("FK_Offer_Candidate_Offer_Shortlist");
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
            entity.Property(e => e.CompanyName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Company_name");
            entity.Property(e => e.Description)
                .HasMaxLength(225)
                .IsUnicode(false);
            entity.Property(e => e.EndDate).HasColumnType("date");
            entity.Property(e => e.JobRole)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PlacementStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Placement_status");
            entity.Property(e => e.StartDate).HasColumnType("date");

            entity.HasOne(d => d.Account).WithMany(p => p.Placements)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Placement_Account");
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
            entity.Property(e => e.Database)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Framework)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Others)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ProgrammingLanguage)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Programming_language");
            entity.Property(e => e.Tools)
                .HasMaxLength(50)
                .IsUnicode(false);

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

        modelBuilder.Entity<ShortlistCandidate>(entity =>
        {
            entity.HasKey(e => e.ShortlistId);

            entity.ToTable("Shortlist_Candidate");

            entity.Property(e => e.ShortlistId).HasColumnName("Shortlist_Id");
            entity.Property(e => e.AccountId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Account_Id");
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
            entity.Property(e => e.EnglishLevel)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("English_Level");
            entity.Property(e => e.ExpectedSalary)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Expected_Salary");
            entity.Property(e => e.ExperienceInYear).HasColumnName("Experience_In_Year");
            entity.Property(e => e.FilteringBy)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("Filtering_By");
            entity.Property(e => e.FinancialIndustry)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Financial_Industry");
            entity.Property(e => e.IntwByRas)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Intw_ByRAS");
            entity.Property(e => e.IntwDateByRas)
                .HasColumnType("date")
                .HasColumnName("IntwDate_ByRAS");
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
            entity.Property(e => e.WorkStatus)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasColumnName("Work_Status");

            entity.HasOne(d => d.Account).WithMany(p => p.ShortlistCandidates)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK_Shortlist_Candidate_Account");
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
