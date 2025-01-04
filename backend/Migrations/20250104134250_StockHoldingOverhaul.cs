using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class StockHoldingOverhaul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClubId",
                table: "StockHolding",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_ClubId",
                table: "StockHolding",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_Club_ClubId",
                table: "StockHolding",
                column: "ClubId",
                principalTable: "Club",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_Club_ClubId",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_ClubId",
                table: "StockHolding");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "StockHolding");
        }
    }
}
