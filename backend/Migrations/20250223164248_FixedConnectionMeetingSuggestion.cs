using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class FixedConnectionMeetingSuggestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestion_MeetingId",
                table: "MeetingsSuggestion",
                column: "MeetingId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_Meeting_MeetingId",
                table: "MeetingsSuggestion",
                column: "MeetingId",
                principalTable: "Meeting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_Meeting_MeetingId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestion_MeetingId",
                table: "MeetingsSuggestion");
        }
    }
}
