using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
   public partial class RemoveMonthId : Migration
   {
      protected override void Up(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.DropColumn(
             name: "MonthId",
             table: "Budgets");
      }

      protected override void Down(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.AddColumn<string>(
             name: "MonthId",
             table: "Budgets",
             nullable: true);
      }
   }
}
