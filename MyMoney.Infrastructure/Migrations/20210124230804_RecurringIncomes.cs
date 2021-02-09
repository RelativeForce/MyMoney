using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
   public partial class RecurringIncomes : Migration
   {
      protected override void Up(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.AddColumn<long>(
             name: "ParentId",
             table: "Incomes",
             nullable: true);

         migrationBuilder.CreateTable(
             name: "RecurringIncomes",
             columns: table => new
             {
                Id = table.Column<long>(nullable: false)
                     .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn)
                     .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                UserId = table.Column<long>(nullable: false),
                Start = table.Column<DateTime>(nullable: false),
                End = table.Column<DateTime>(nullable: false),
                Recurrence = table.Column<int>(nullable: false),
                Name = table.Column<string>(maxLength: 100, nullable: false),
                Notes = table.Column<string>(maxLength: 1000, nullable: false),
                Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
             },
             constraints: table =>
             {
                table.PrimaryKey("PK_RecurringIncomes", x => x.Id);
                table.ForeignKey(
                       name: "FK_RecurringIncomes_Users_UserId",
                       column: x => x.UserId,
                       principalTable: "Users",
                       principalColumn: "Id",
                       onDelete: ReferentialAction.Cascade);
             });

         migrationBuilder.CreateIndex(
             name: "IX_Incomes_ParentId",
             table: "Incomes",
             column: "ParentId");

         migrationBuilder.CreateIndex(
             name: "IX_RecurringIncomes_UserId_Start_End_Recurrence_Name",
             table: "RecurringIncomes",
             columns: new[] { "UserId", "Start", "End", "Recurrence", "Name" },
             unique: true);

         migrationBuilder.AddForeignKey(
             name: "FK_Incomes_RecurringIncomes_ParentId",
             table: "Incomes",
             column: "ParentId",
             principalTable: "RecurringIncomes",
             principalColumn: "Id",
             onDelete: ReferentialAction.Restrict);
      }

      protected override void Down(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.DropForeignKey(
             name: "FK_Incomes_RecurringIncomes_ParentId",
             table: "Incomes");

         migrationBuilder.DropTable(
             name: "RecurringIncomes");

         migrationBuilder.DropIndex(
             name: "IX_Incomes_ParentId",
             table: "Incomes");

         migrationBuilder.DropColumn(
             name: "ParentId",
             table: "Incomes");
      }
   }
}
