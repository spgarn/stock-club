using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class STONKS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "StockName",
                table: "StockHolding",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            // First drop the old column
            migrationBuilder.DropColumn(
                name: "StockId",
                table: "StockHolding");

            // Then add the FK column that EF needs
            migrationBuilder.AddColumn<int>(
                name: "StockId",
                table: "StockHolding",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "OverridePrice",
                table: "StockHolding",
                type: "numeric",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Stock",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StockName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CurrentPrice = table.Column<decimal>(type: "numeric", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_StockId",
                table: "StockHolding",
                column: "StockId");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_StockName",
                table: "Stock",
                column: "StockName",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding",
                column: "StockId",
                principalTable: "Stock",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_Stock_StockId",
                table: "StockHolding");

            migrationBuilder.DropTable(
                name: "Stock");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_StockId",
                table: "StockHolding");

            migrationBuilder.DropColumn(
                name: "OverridePrice",
                table: "StockHolding");

            migrationBuilder.AlterColumn<string>(
                name: "StockName",
                table: "StockHolding",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StockId",
                table: "StockHolding",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
