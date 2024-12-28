using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class RemovedMeetingProtocols : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.DropTable(
                name: "MeetingProtocolTemplate");

            migrationBuilder.RenameColumn(
                name: "MeetingProtocolTemplateId",
                table: "Meeting",
                newName: "ClubTemplatesId");

            migrationBuilder.RenameIndex(
                name: "IX_Meeting_MeetingProtocolTemplateId",
                table: "Meeting",
                newName: "IX_Meeting_ClubTemplatesId");

            migrationBuilder.CreateTable(
                name: "ClubTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Markdown = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClubId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubTemplates_Club_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Club",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClubTemplates_ClubId",
                table: "ClubTemplates",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_ClubTemplates_ClubTemplatesId",
                table: "Meeting",
                column: "ClubTemplatesId",
                principalTable: "ClubTemplates",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_ClubTemplates_ClubTemplatesId",
                table: "Meeting");

            migrationBuilder.DropTable(
                name: "ClubTemplates");

            migrationBuilder.RenameColumn(
                name: "ClubTemplatesId",
                table: "Meeting",
                newName: "MeetingProtocolTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_Meeting_ClubTemplatesId",
                table: "Meeting",
                newName: "IX_Meeting_MeetingProtocolTemplateId");

            migrationBuilder.CreateTable(
                name: "MeetingProtocolTemplate",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClubId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Markdown = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingProtocolTemplate", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MeetingProtocolTemplate_Club_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Club",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingProtocolTemplate_ClubId",
                table: "MeetingProtocolTemplate",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting",
                column: "MeetingProtocolTemplateId",
                principalTable: "MeetingProtocolTemplate",
                principalColumn: "Id");
        }
    }
}
