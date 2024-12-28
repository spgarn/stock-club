using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class MeetingProtocolFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClubId",
                table: "MeetingProtocolTemplate",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "MeetingProtocolTemplate",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingProtocolTemplate_ClubId",
                table: "MeetingProtocolTemplate",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingProtocolTemplate_Club_ClubId",
                table: "MeetingProtocolTemplate",
                column: "ClubId",
                principalTable: "Club",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingProtocolTemplate_Club_ClubId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.DropIndex(
                name: "IX_MeetingProtocolTemplate_ClubId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "MeetingProtocolTemplate");
        }
    }
}
