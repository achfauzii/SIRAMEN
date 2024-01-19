using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RasManagement.Migrations
{
    /// <inheritdoc />
    public partial class add_ipk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Qualification_Account",
                table: "Qualification");

            migrationBuilder.DropTable(
                name: "Offer_Candidate");

            migrationBuilder.DropTable(
                name: "Shortlist_Candidate");

            migrationBuilder.RenameColumn(
                name: "NameOf_User",
                table: "NonRAS_Candidate",
                newName: "Tech_Test");

            migrationBuilder.AlterColumn<string>(
                name: "Tools",
                table: "Qualification",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Programming_language",
                table: "Qualification",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Others",
                table: "Qualification",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Framework",
                table: "Qualification",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Database",
                table: "Qualification",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Project_History",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Placement",
                type: "varchar(max)",
                unicode: false,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(225)",
                oldUnicode: false,
                oldMaxLength: 225,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PIC",
                table: "Placement",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "NonRAS_Id",
                table: "NonRAS_Candidate",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldUnicode: false,
                oldMaxLength: 20)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Client_Id",
                table: "NonRAS_Candidate",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ipk",
                table: "NonRAS_Candidate",
                type: "varchar(5)",
                unicode: false,
                maxLength: 5,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Organizer",
                table: "NonFormal_Edu",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "NonFormal_Edu",
                type: "varchar(max)",
                unicode: false,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "NonFormal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Formal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "Ipk",
                table: "Formal_Edu",
                type: "varchar(5)",
                unicode: false,
                maxLength: 5,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Employment_History",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Certificate",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<bool>(
                name: "IsChangePassword",
                table: "Account",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "NIK",
                table: "Account",
                type: "varchar(6)",
                unicode: false,
                maxLength: 6,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Account",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Client_Name",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameOfClient = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client_Name", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "History_Log",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountId = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Name = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Activity = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Time_Stamp = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_History_Log", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Time_Sheet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Activity = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Date = table.Column<DateTime>(type: "date", nullable: true),
                    Flag = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Category = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Known_by = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Placement_status_id = table.Column<int>(type: "int", nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Time_Sheet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Time_Sheet_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                    table.ForeignKey(
                        name: "FK_Time_Sheet_Placement",
                        column: x => x.Placement_status_id,
                        principalTable: "Placement",
                        principalColumn: "Placement_status_id");
                });

            migrationBuilder.CreateTable(
                name: "Position",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Position = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Level = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Quantity = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Client_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Position", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Position_Client",
                        column: x => x.Client_Id,
                        principalTable: "Client_Name",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Tracking_interview",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NonRAS_Id = table.Column<int>(type: "int", nullable: true),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Client_Id = table.Column<int>(type: "int", nullable: true),
                    Position_Id = table.Column<int>(type: "int", nullable: true),
                    Intvw_date = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Intvw_status = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Notes = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tracking_interview", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tracking_interview_Account",
                        column: x => x.Account_Id,
                        principalTable: "Account",
                        principalColumn: "Account_Id");
                    table.ForeignKey(
                        name: "FK_Tracking_interview_Client",
                        column: x => x.Client_Id,
                        principalTable: "Client_Name",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Tracking_interview_NonRAS_Candidate",
                        column: x => x.NonRAS_Id,
                        principalTable: "NonRAS_Candidate",
                        principalColumn: "NonRAS_Id");
                    table.ForeignKey(
                        name: "FK_Tracking_interview_Position",
                        column: x => x.Position_Id,
                        principalTable: "Position",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Position_Client_Id",
                table: "Position",
                column: "Client_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Time_Sheet_Account_Id",
                table: "Time_Sheet",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Time_Sheet_Placement_status_id",
                table: "Time_Sheet",
                column: "Placement_status_id");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_interview_Account_Id",
                table: "Tracking_interview",
                column: "Account_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_interview_Client_Id",
                table: "Tracking_interview",
                column: "Client_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_interview_NonRAS_Id",
                table: "Tracking_interview",
                column: "NonRAS_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Tracking_interview_Position_Id",
                table: "Tracking_interview",
                column: "Position_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Qualification_Account",
                table: "Qualification",
                column: "Account_Id",
                principalTable: "Account",
                principalColumn: "Account_Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Qualification_Account",
                table: "Qualification");

            migrationBuilder.DropTable(
                name: "History_Log");

            migrationBuilder.DropTable(
                name: "Time_Sheet");

            migrationBuilder.DropTable(
                name: "Tracking_interview");

            migrationBuilder.DropTable(
                name: "Position");

            migrationBuilder.DropTable(
                name: "Client_Name");

            migrationBuilder.DropColumn(
                name: "PIC",
                table: "Placement");

            migrationBuilder.DropColumn(
                name: "Client_Id",
                table: "NonRAS_Candidate");

            migrationBuilder.DropColumn(
                name: "Ipk",
                table: "NonRAS_Candidate");

            migrationBuilder.DropColumn(
                name: "Ipk",
                table: "Formal_Edu");

            migrationBuilder.DropColumn(
                name: "NIK",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Account");

            migrationBuilder.RenameColumn(
                name: "Tech_Test",
                table: "NonRAS_Candidate",
                newName: "NameOf_User");

            migrationBuilder.AlterColumn<string>(
                name: "Tools",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Programming_language",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Others",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Framework",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Database",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Qualification",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Project_History",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Placement",
                type: "varchar(225)",
                unicode: false,
                maxLength: 225,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NonRAS_Id",
                table: "NonRAS_Candidate",
                type: "varchar(20)",
                unicode: false,
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "Organizer",
                table: "NonFormal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "NonFormal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(max)",
                oldUnicode: false);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "NonFormal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Formal_Edu",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Employment_History",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Account_Id",
                table: "Certificate",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldUnicode: false,
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsChangePassword",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Shortlist_Candidate",
                columns: table => new
                {
                    Shortlist_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Account_Id = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Current_Salary = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    CV_Berca = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Domisili = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    English_Level = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Expected_Salary = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Experience_In_Year = table.Column<int>(type: "int", nullable: true),
                    Filtering_By = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: true),
                    Financial_Industry = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Intw_ByRAS = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    IntwDate_ByRAS = table.Column<DateTime>(type: "date", nullable: true),
                    Level = table.Column<string>(type: "varchar(30)", unicode: false, maxLength: 30, nullable: true),
                    Level_Rekom = table.Column<string>(type: "varchar(8)", unicode: false, maxLength: 8, nullable: true),
                    Negotiable = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true),
                    Notes = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Notice_Periode = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    Position = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    Raw_CV = table.Column<string>(type: "varchar(max)", unicode: false, nullable: true),
                    Work_Status = table.Column<string>(type: "varchar(5)", unicode: false, maxLength: 5, nullable: true)
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
                name: "Offer_Candidate",
                columns: table => new
                {
                    OfferCandidate_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Shortlist_Id = table.Column<int>(type: "int", nullable: true),
                    IntwDate_User = table.Column<DateTime>(type: "date", nullable: true),
                    Intw_User = table.Column<string>(type: "varchar(12)", unicode: false, maxLength: 12, nullable: true),
                    NameOf_User = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
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
                name: "IX_Offer_Candidate_Shortlist_Id",
                table: "Offer_Candidate",
                column: "Shortlist_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Shortlist_Candidate_Account_Id",
                table: "Shortlist_Candidate",
                column: "Account_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Qualification_Account",
                table: "Qualification",
                column: "Account_Id",
                principalTable: "Account",
                principalColumn: "Account_Id");
        }
    }
}
