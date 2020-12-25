using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
    public partial class UniqueIncomesAndBudgets : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_Users_UserId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_UserId",
                table: "Incomes");

            migrationBuilder.DropForeignKey(
                name: "FK_Budgets_Users_UserId",
                table: "Budgets");

            migrationBuilder.DropIndex(
                   name: "IX_Budgets_UserId",
                   table: "Budgets");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Incomes",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Budgets",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_UserId_Date_Name",
                table: "Incomes",
                columns: new[] { "UserId", "Date", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_UserId_Year_Month_Name",
                table: "Budgets",
                columns: new[] { "UserId", "Year", "Month", "Name" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Incomes_UserId_Date_Name",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Budgets_UserId_Year_Month_Name",
                table: "Budgets");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Incomes",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Budgets",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_UserId",
                table: "Incomes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Budgets_UserId",
                table: "Budgets",
                column: "UserId");
        }
    }
}
