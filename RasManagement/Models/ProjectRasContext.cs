using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace RasManagement.Models;

public partial class ProjectRasContext : DbContext
{
    public ProjectRasContext()
    {
    }

    public ProjectRasContext(DbContextOptions<ProjectRasContext> options)
        : base(options)
    {
    }

    public virtual DbSet<RasprojectAccount> RasprojectAccounts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server = RAS-DHARU; Database = Project_RAS; user id = sa; password = 5aPassword; Encrypt = false; TrustServerCertificate=Yes; MultipleActiveResultSets=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RasprojectAccount>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("RASProject_Account");

            entity.Property(e => e.AccountId)
                .HasMaxLength(5)
                .HasColumnName("Account_Id");
            entity.Property(e => e.Email).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
