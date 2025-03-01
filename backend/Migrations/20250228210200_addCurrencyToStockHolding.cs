using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class addCurrencyToStockHolding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "StockHolding",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "StockHolding");
        }
    }
}
