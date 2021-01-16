using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
   public partial class TransactionToRecurring : Migration
   {
      protected override void Up(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.AddColumn<long>(
             name: "ParentId",
             table: "Transactions",
             nullable: true);

         migrationBuilder.CreateIndex(
             name: "IX_Transactions_ParentId",
             table: "Transactions",
             column: "ParentId");

         migrationBuilder.AddForeignKey(
             name: "FK_Transactions_RecurringTransactions_ParentId",
             table: "Transactions",
             column: "ParentId",
             principalTable: "RecurringTransactions",
             principalColumn: "Id",
             onDelete: ReferentialAction.Restrict);
      }

      protected override void Down(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.DropForeignKey(
             name: "FK_Transactions_RecurringTransactions_ParentId",
             table: "Transactions");

         migrationBuilder.DropIndex(
             name: "IX_Transactions_ParentId",
             table: "Transactions");

         migrationBuilder.DropColumn(
             name: "ParentId",
             table: "Transactions");
      }
   }
}
