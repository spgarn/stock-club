using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class removedEmptyRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MeetingsSuggestionsId",
                table: "MeetingsSuggestionsUpvote");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MeetingsSuggestionsId",
                table: "MeetingsSuggestionsUpvote",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
