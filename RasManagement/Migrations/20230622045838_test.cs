using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RasManagement.Migrations
{
    /// <inheritdoc />
    public partial class test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    Account_Id = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Nickname = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Fullname = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Birthplace = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Birthdate = table.Column<DateTime>(type: "date", nullable: false),
                    Religion = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    Gender = table.Column<bool>(type: "bit", nullable: true),
                    Maritalstatus = table.Column<bool>(type: "bit", nullable: true),
                    Hiredstatus = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    Nationality = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: true),
                    Phone = table.Column<string>(type: "varchar(15)", unicode: false, maxLength: 15, nullable: false),
                    Address = table.Column<string>(type: "varchar(200)", unicode: false, maxLength: 200, nullable: false),
                    Image = table.Column<byte[]>(type: "image", nullable: true),
                    Role_Id = table.Column<string>(type: "varchar(4)", unicode: false, maxLength: 4, nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_Account_Role_Id",
                table: "Account",
                column: "Role_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Account");

            migrationBuilder.DropTable(
                name: "Role");
        }
    }
}
