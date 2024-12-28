using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class NotesToMeetingProtocol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Meeting",
                newName: "MeetingProtocol");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndedAt",
                table: "Meeting",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndedAt",
                table: "Meeting");

            migrationBuilder.RenameColumn(
                name: "MeetingProtocol",
                table: "Meeting",
                newName: "Notes");
        }
    }
}
