using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class removedMoreBrokenRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId1",
                table: "MeetingChat");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId1",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_UserId1",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestion_UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropIndex(
                name: "IX_MeetingChat_UserId1",
                table: "MeetingChat");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "StockHolding");

            migrationBuilder.DropColumn(
                name: "MeetingsSuggestionsId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingChat");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "StockHolding",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsUpvote",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestion",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingChat",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_UserId",
                table: "StockHolding",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestion_UserId",
                table: "MeetingsSuggestion",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingChat_UserId",
                table: "MeetingChat",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId",
                table: "MeetingChat",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId",
                table: "MeetingsSuggestion",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId",
                table: "StockHolding",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId",
                table: "MeetingChat");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_UserId",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestion_UserId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropIndex(
                name: "IX_MeetingChat_UserId",
                table: "MeetingChat");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "StockHolding",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "StockHolding",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsUpvote",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MeetingsSuggestionsId",
                table: "MeetingsSuggestionsDownvote",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "MeetingsSuggestion",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestion",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "MeetingChat",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingChat",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_UserId1",
                table: "StockHolding",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestion_UserId1",
                table: "MeetingsSuggestion",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingChat_UserId1",
                table: "MeetingChat",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId1",
                table: "MeetingChat",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId1",
                table: "MeetingsSuggestion",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId1",
                table: "StockHolding",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
