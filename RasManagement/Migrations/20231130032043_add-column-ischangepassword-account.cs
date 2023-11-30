using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RasManagement.Migrations
{
    /// <inheritdoc />
    public partial class addcolumnischangepasswordaccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Data_universitas",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nama_universitas = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Data_uni__3213E83F19FE3B0C", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Dept_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nama_Dept = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Dept_Id);
                });

            migrationBuilder.CreateTable(
                name: "NonRAS_Candidate",
                columns: table => new
                {
                    NonRAS_Id = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: false),
                    Fullname = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Position = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Skillset = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Education = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    University = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Domisili = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Birthdate = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Level = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Experience_In_Year = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Filtering_By = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Work_Status = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Notice_Periode = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Financial_Industry = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Raw_CV = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CV_Berca = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    English_Level = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Current_Salary = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Expected_Salary = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Negotiable = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Intw_ByRAS = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    IntwDate_ByRAS = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Intw_User = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    NameOf_User = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    IntwDate_User = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Level_Rekom = table.Column<string>(type: "varchar(8)", unicode: false, maxLength: 8, nullable: true),
                    Status = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Notes = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Last_Modified = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NonRAS_Candidate", x => x.NonRAS_Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Role_Id = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: false),
                    Rolename = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Role_Id);
                });

            migrationBuilder.CreateTable(
                name: "Account",
                columns: table => new
                {
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Nickname = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Fullname = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Birthplace = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Birthdate = table.Column<DateTime>(type: "date", nullable: true),
                    Religion = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Gender = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Maritalstatus = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Hiredstatus = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Nationality = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    Phone = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Address = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: true),
                    Join_date = table.Column<DateTime>(type: "date", nullable: true),
                    Start_contract = table.Column<DateTime>(type: "date", nullable: true),
                    End_contract = table.Column<DateTime>(type: "date", nullable: true),
                    Image = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Role_Id = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    IsChangePassword = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Account", x => x.Account_Id);
                    table.ForeignKey(
                        name: "FK_Account_Role",
                        column: x => x.Role_Id,
                        principalTable: "Role",
                        principalColumn: "Role_Id");
                });

            migrationBuilder.CreateTable(
                name: "AssetsManagement",
                columns: table => new
                {
                    AssetsManagement_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RFID = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Nama = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Processor = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Display = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    OperatingSystem = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    RAM = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    SSD = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    HDD = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    GraphicCard = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Charger = table.Column<bool>(type: "bit", nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AssetsMa__1AD8D05B51F60BDA", x => x.AssetsManagement_Id);
                    table.ForeignKey(
                        name: "FK_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Certificate",
                columns: table => new
                {
                    Certificate_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Publisher = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Publication_year = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Valid_until = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificate", x => x.Certificate_id);
                    table.ForeignKey(
                        name: "FK_Certificate_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Employment_History",
                columns: table => new
                {
                    Work_experience_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Job = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Period = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employment_History", x => x.Work_experience_Id);
                    table.ForeignKey(
                        name: "FK_Employment_History_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Formal_Edu",
                columns: table => new
                {
                    FormalEdu_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UniversityName = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Location = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Major = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Degree = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Years = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formal_Edu", x => x.FormalEdu_id);
                    table.ForeignKey(
                        name: "FK_Formal_Edu_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Last_Modified",
                columns: table => new
                {
                    Last_Modified_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    LastModified_ShortList = table.Column<DateTime>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Last_Modified", x => x.Last_Modified_Id);
                    table.ForeignKey(
                        name: "FK_Last_Modified_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "NonFormal_Edu",
                columns: table => new
                {
                    NonFormal_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Organizer = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Years = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NonFormal_Edu", x => x.NonFormal_id);
                    table.ForeignKey(
                        name: "FK_NonFormal_Edu_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Placement",
                columns: table => new
                {
                    Placement_status_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Company_name = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    JobRole = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Description = table.Column<string>(type: "varchar(225)", unicode: false, maxLength: 225, nullable: true),
                    Placement_status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    StartDate = table.Column<DateTime>(type: "date", nullable: true),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Placement", x => x.Placement_status_id);
                    table.ForeignKey(
                        name: "FK_Placement_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Project_History",
                columns: table => new
                {
                    Project_history_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Project_name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Job_spec = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Year = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Company_name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: false),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project_History", x => x.Project_history_id);
                    table.ForeignKey(
                        name: "FK_Project_History_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Qualification",
                columns: table => new
                {
                    Qualification_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Framework = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Programming_language = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Database = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Tools = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Others = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualification", x => x.Qualification_Id);
                    table.ForeignKey(
                        name: "FK_Qualification_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "Shortlist_Candidate",
                columns: table => new
                {
                    Shortlist_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Position = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Domisili = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Level = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Experience_In_Year = table.Column<int>(type: "int", nullable: true),
                    Filtering_By = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Work_Status = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Notice_Periode = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Financial_Industry = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Raw_CV = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    CV_Berca = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    English_Level = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Current_Salary = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Expected_Salary = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Negotiable = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Intw_ByRAS = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    IntwDate_ByRAS = table.Column<DateTime>(type: "date", nullable: true),
                    Level_Rekom = table.Column<string>(type: "varchar(8)", unicode: false, maxLength: 8, nullable: true),
                    Notes = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shortlist_Candidate", x => x.Shortlist_Id);
                    table.ForeignKey(
                        name: "FK_Shortlist_Candidate_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                });

            migrationBuilder.CreateTable(
                name: "TurnOver",
                columns: table => new
                {
                    TurnOver_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Exit_date = table.Column<DateTime>(type: "date", nullable: false),
                    Description = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Dept_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TurnOver", x => x.TurnOver_Id);
                    table.ForeignKey(
                        name: "FK_TurnOver_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                    table.ForeignKey(
                        name: "FK_TurnOver_Department",
                        column: x => x.Dept_Id,
                        principalTable: "Department",
                        principalColumn: "Dept_Id");
                });

            migrationBuilder.CreateTable(
                name: "Offer_Candidate",
                columns: table => new
                {
                    OfferCandidate_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Intw_User = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    NameOf_User = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    IntwDate_User = table.Column<DateTime>(type: "date", nullable: true),
                    Shortlist_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offer_Candidate", x => x.OfferCandidate_Id);
                    table.ForeignKey(
                        name: "FK_Offer_Candidate_Offer_Shortlist",
                        column: x => x.Shortlist_Id,
                        principalTable: "Shortlist_Candidate",
                        principalColumn: "Shortlist_Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Account_Role_Id",
                table: "Account",
                column: "Role_Id");

            migrationBuilder.CreateIndex(
                name: "IX_AssetsManagement_Account_Id",
                table: "AssetsManagement",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Certificate_Account_Id",
                table: "Certificate",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Department",
                table: "Department",
                column: "Dept_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Employment_History_Account_Id",
                table: "Employment_History",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Formal_Edu_Account_Id",
                table: "Formal_Edu",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Last_Modified_Account_Id",
                table: "Last_Modified",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_NonFormal_Edu_Account_Id",
                table: "NonFormal_Edu",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Offer_Candidate_Shortlist_Id",
                table: "Offer_Candidate",
                column: "Shortlist_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Placement_Account_Id",
                table: "Placement",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Project_History_Account_Id",
                table: "Project_History",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Qualification_Account_Id",
                table: "Qualification",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Shortlist_Candidate_Account_Id",
                table: "Shortlist_Candidate",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TurnOver_Account_Id",
                table: "TurnOver",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TurnOver_Dept_Id",
                table: "TurnOver",
                column: "Dept_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AssetsManagement");

            migrationBuilder.DropTable(
                name: "Certificate");

            migrationBuilder.DropTable(
                name: "Data_universitas");

            migrationBuilder.DropTable(
                name: "Employment_History");

            migrationBuilder.DropTable(
                name: "Formal_Edu");

            migrationBuilder.DropTable(
                name: "Last_Modified");

            migrationBuilder.DropTable(
                name: "NonFormal_Edu");

            migrationBuilder.DropTable(
                name: "NonRAS_Candidate");

            migrationBuilder.DropTable(
                name: "Offer_Candidate");

            migrationBuilder.DropTable(
                name: "Placement");

            migrationBuilder.DropTable(
                name: "Project_History");

            migrationBuilder.DropTable(
                name: "Qualification");

            migrationBuilder.DropTable(
                name: "TurnOver");

            migrationBuilder.DropTable(
                name: "Shortlist_Candidate");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
