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

    public virtual DbSet<Certificate> Certificates { get; set; }

    public virtual DbSet<DataUniversita> DataUniversitas { get; set; }

    public virtual DbSet<EmploymentHistory> EmploymentHistories { get; set; }

    public virtual DbSet<FormalEdu> FormalEdus { get; set; }

    public virtual DbSet<NonFormalEdu> NonFormalEdus { get; set; }

    public virtual DbSet<Placement> Placements { get; set; }

    public virtual DbSet<ProjectHistory> ProjectHistories { get; set; }

    public virtual DbSet<Qualification> Qualifications { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server = RAS-FAUZI; Database = Project_RASManagement; user id = sa; password = 5aPassword; Encrypt = false; TrustServerCertificate=Yes; MultipleActiveResultSets=True;");
   // optionsBuilder.UseSqlServer("Data Source=SQL5104.site4now.net,1433;Initial Catalog=db_a9df6a_ras;User Id=db_a9df6a_ras_admin;Password=bHp12345;");

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

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Account_Role");
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
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("Publication_year");
            entity.Property(e => e.Publisher)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ValidUntil)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("Valid_until");

            entity.HasOne(d => d.Account).WithMany(p => p.Certificates)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Certificate_Account");
        });

        modelBuilder.Entity<DataUniversita>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Data_uni__3213E83FDAF93A95");

            entity.ToTable("Data_Universitas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NamaUniversitas)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("nama_universitas");
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
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Job)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Period)
                .HasMaxLength(30)
                .IsUnicode(false);
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

            entity.HasOne(d => d.Account).WithMany(p => p.FormalEdus)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Formal_Edu_Account");
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
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Organizer)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Years)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.NonFormalEdus)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NonFormal_Edu_Account");
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
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Company_name");
            entity.Property(e => e.Description)
                .HasMaxLength(50)
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
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.Framework)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.Others)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ProgrammingLanguage)
                .HasMaxLength(70)
                .IsUnicode(false)
                .HasColumnName("Programming_language");
            entity.Property(e => e.Tools)
                .HasMaxLength(70)
                .IsUnicode(false);

            entity.HasOne(d => d.Account).WithMany(p => p.Qualifications)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
