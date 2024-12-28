using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class ConnectedChats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MeetingAgenda",
                table: "Meeting",
                newName: "Notes");

            migrationBuilder.AddColumn<int>(
                name: "MeetingId",
                table: "MeetingChat",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Agenda",
                table: "Meeting",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingChat_MeetingId",
                table: "MeetingChat",
                column: "MeetingId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingChat_Meeting_MeetingId",
                table: "MeetingChat",
                column: "MeetingId",
                principalTable: "Meeting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingChat_Meeting_MeetingId",
                table: "MeetingChat");

            migrationBuilder.DropIndex(
                name: "IX_MeetingChat_MeetingId",
                table: "MeetingChat");

            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "MeetingChat");

            migrationBuilder.DropColumn(
                name: "Agenda",
                table: "Meeting");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "Meeting",
                newName: "MeetingAgenda");
        }
    }
}
