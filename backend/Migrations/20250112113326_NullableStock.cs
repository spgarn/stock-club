using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class NullableStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding");

            migrationBuilder.AlterColumn<int>(
                name: "StockId",
                table: "StockHolding",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding",
                column: "StockId",
                principalTable: "Stock",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding");

            migrationBuilder.AlterColumn<int>(
                name: "StockId",
                table: "StockHolding",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding",
                column: "StockId",
                principalTable: "Stock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
