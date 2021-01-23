using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
   public partial class AddIncomeNotes : Migration
   {
      protected override void Up(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "Transactions",
             maxLength: 1000,
             nullable: false,
             oldClrType: typeof(string));

         migrationBuilder.AlterColumn<string>(
             name: "Description",
             table: "Transactions",
             maxLength: 100,
             nullable: false,
             oldClrType: typeof(string));

         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "RecurringTransactions",
             maxLength: 1000,
             nullable: false,
             oldClrType: typeof(string));

         migrationBuilder.AlterColumn<string>(
             name: "Description",
             table: "RecurringTransactions",
             maxLength: 100,
             nullable: false,
             oldClrType: typeof(string));

         migrationBuilder.AlterColumn<string>(
             name: "Name",
             table: "Incomes",
             maxLength: 100,
             nullable: false,
             oldClrType: typeof(string));

         migrationBuilder.AddColumn<string>(
             name: "Notes",
             table: "Incomes",
             maxLength: 1000,
             nullable: false,
             defaultValue: "");

         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "Budgets",
             maxLength: 1000,
             nullable: false,
             oldClrType: typeof(string),
             oldNullable: true);

         migrationBuilder.AlterColumn<string>(
             name: "Name",
             table: "Budgets",
             maxLength: 100,
             nullable: false,
             oldClrType: typeof(string));
      }

      protected override void Down(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.DropColumn(
             name: "Notes",
             table: "Incomes");

         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "Transactions",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 1000);

         migrationBuilder.AlterColumn<string>(
             name: "Description",
             table: "Transactions",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 100);

         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "RecurringTransactions",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 1000);

         migrationBuilder.AlterColumn<string>(
             name: "Description",
             table: "RecurringTransactions",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 100);

         migrationBuilder.AlterColumn<string>(
             name: "Name",
             table: "Incomes",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 100);

         migrationBuilder.AlterColumn<string>(
             name: "Notes",
             table: "Budgets",
             nullable: true,
             oldClrType: typeof(string),
             oldMaxLength: 1000);

         migrationBuilder.AlterColumn<string>(
             name: "Name",
             table: "Budgets",
             nullable: false,
             oldClrType: typeof(string),
             oldMaxLength: 100);
      }
   }
}
