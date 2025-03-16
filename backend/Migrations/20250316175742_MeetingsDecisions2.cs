using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class MeetingsDecisions2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsDecisions_MeetingsDecis~",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsDecisions_MeetingsDecisio~",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropColumn(
                name: "MeetingsDecisionsId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropColumn(
                name: "MeetingsDecisionsId",
                table: "MeetingsSuggestionsDownvote");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MeetingsDecisionsId",
                table: "MeetingsSuggestionsUpvote",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MeetingsDecisionsId",
                table: "MeetingsSuggestionsDownvote",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsDecisions_MeetingsDecis~",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsDecisionsId",
                principalTable: "MeetingsDecisions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsDecisions_MeetingsDecisio~",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsDecisionsId",
                principalTable: "MeetingsDecisions",
                principalColumn: "Id");
        }
    }
}
