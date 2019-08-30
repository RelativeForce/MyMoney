using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
    public partial class BudgetStartEnd : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Budgets_UserId_Month",
                table: "Budgets");

            migrationBuilder.RenameColumn(
                name: "Month",
                table: "Budgets",
                newName: "Start");

            migrationBuilder.AddColumn<DateTime>(
                name: "End",
                table: "Budgets",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Budgets",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_UserId_Start_End_Amount",
                table: "Budgets",
                columns: new[] { "UserId", "Start", "End", "Amount" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Budgets_UserId_Start_End_Amount",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "End",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Budgets");

            migrationBuilder.RenameColumn(
                name: "Start",
                table: "Budgets",
                newName: "Month");

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_UserId_Month",
                table: "Budgets",
                columns: new[] { "UserId", "Month" },
                unique: true);
        }
    }
}
