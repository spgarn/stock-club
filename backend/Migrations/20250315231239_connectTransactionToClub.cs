using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class connectTransactionToClub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClubId",
                table: "Transaction",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_ClubId",
                table: "Transaction",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Club_ClubId",
                table: "Transaction",
                column: "ClubId",
                principalTable: "Club",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Club_ClubId",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_ClubId",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "Transaction");
        }
    }
}
