using Microsoft.EntityFrameworkCore.Migrations;

namespace MyMoney.Infrastructure.Migrations
{
   public partial class UserFeatures : Migration
   {
      protected override void Up(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.CreateTable(
             name: "UserFeature",
             columns: table => new
             {
                UserId = table.Column<long>(nullable: false),
                Feature = table.Column<int>(nullable: false)
             },
             constraints: table =>
             {
                table.PrimaryKey("PK_UserFeature", x => new { x.UserId, x.Feature });
                table.ForeignKey(
                       name: "FK_UserFeature_Users_UserId",
                       column: x => x.UserId,
                       principalTable: "Users",
                       principalColumn: "Id",
                       onDelete: ReferentialAction.Cascade);
             });
      }

      protected override void Down(MigrationBuilder migrationBuilder)
      {
         migrationBuilder.DropTable(
             name: "UserFeature");
      }
   }
}
