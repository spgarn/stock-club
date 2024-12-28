using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class userString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsSuggestion_MeetingsSugg~",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsSuggestion_MeetingsSugges~",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsSuggestionsId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsSuggestionsId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsDownvote_UserId1",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsUpvote",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "MeetingsSuggestionId",
                table: "MeetingsSuggestionsUpvote",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "MeetingsSuggestionId",
                table: "MeetingsSuggestionsDownvote",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsSuggestionId",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsSuggestionId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsSuggestionId",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsSuggestionId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_UserId",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsSuggestion_MeetingsSugg~",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsSuggestionId",
                principalTable: "MeetingsSuggestion",
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
                name: "FK_MeetingsSuggestionsUpvote_MeetingsSuggestion_MeetingsSugges~",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsSuggestionId",
                principalTable: "MeetingsSuggestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsSuggestion_MeetingsSugg~",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsSuggestion_MeetingsSugges~",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsSuggestionId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsSuggestionId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsDownvote_UserId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropColumn(
                name: "MeetingsSuggestionId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropColumn(
                name: "MeetingsSuggestionId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "MeetingsSuggestionsUpvote",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestionsUpvote",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "MeetingsSuggestionsDownvote",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsSuggestionsId",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsSuggestionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId1",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsSuggestionsId",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsSuggestionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_UserId1",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsSuggestion_MeetingsSugg~",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsSuggestionsId",
                principalTable: "MeetingsSuggestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsSuggestion_MeetingsSugges~",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsSuggestionsId",
                principalTable: "MeetingsSuggestion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
