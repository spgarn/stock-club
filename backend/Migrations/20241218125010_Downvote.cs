using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class Downvote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeetingsSuggestionsDownvote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MeetingsSuggestionsId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    UserId1 = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingsSuggestionsDownvote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                        column: x => x.UserId1,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingsSuggestionsDownvote_MeetingsSuggestion_MeetingsSugg~",
                        column: x => x.MeetingsSuggestionsId,
                        principalTable: "MeetingsSuggestion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsSuggestionsId",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsSuggestionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_UserId1",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingsSuggestionsDownvote");
        }
    }
}
