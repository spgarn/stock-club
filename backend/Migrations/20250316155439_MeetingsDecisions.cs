using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class MeetingsDecisions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "MeetingsDecisions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MeetingId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClubId = table.Column<int>(type: "integer", nullable: false),
                    Completed = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingsDecisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingsDecisions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MeetingsDecisions_Club_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Club",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingsDecisions_Meeting_MeetingId",
                        column: x => x.MeetingId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingsDecisionsDownvote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MeetingsDecisionsId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingsDecisionsDownvote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingsDecisionsDownvote_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MeetingsDecisionsDownvote_MeetingsDecisions_MeetingsDecisio~",
                        column: x => x.MeetingsDecisionsId,
                        principalTable: "MeetingsDecisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingsDecisionsUpvote",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MeetingsDecisionsId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingsDecisionsUpvote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingsDecisionsUpvote_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MeetingsDecisionsUpvote_MeetingsDecisions_MeetingsDecisions~",
                        column: x => x.MeetingsDecisionsId,
                        principalTable: "MeetingsDecisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsUpvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsDownvote_MeetingsDecisionsId",
                table: "MeetingsSuggestionsDownvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisions_ClubId",
                table: "MeetingsDecisions",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisions_MeetingId",
                table: "MeetingsDecisions",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisions_UserId",
                table: "MeetingsDecisions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisionsDownvote_MeetingsDecisionsId",
                table: "MeetingsDecisionsDownvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisionsDownvote_UserId",
                table: "MeetingsDecisionsDownvote",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisionsUpvote_MeetingsDecisionsId",
                table: "MeetingsDecisionsUpvote",
                column: "MeetingsDecisionsId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsDecisionsUpvote_UserId",
                table: "MeetingsDecisionsUpvote",
                column: "UserId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_MeetingsDecisions_MeetingsDecis~",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_MeetingsDecisions_MeetingsDecisio~",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropTable(
                name: "MeetingsDecisionsDownvote");

            migrationBuilder.DropTable(
                name: "MeetingsDecisionsUpvote");

            migrationBuilder.DropTable(
                name: "MeetingsDecisions");

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
    }
}
