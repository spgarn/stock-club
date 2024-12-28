using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class AddedAgenda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingProtocolTemplate_Meeting_MeetingId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.DropIndex(
                name: "IX_MeetingProtocolTemplate_MeetingId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.DropColumn(
                name: "MeetingId",
                table: "MeetingProtocolTemplate");

            migrationBuilder.AddColumn<string>(
                name: "MeetingAgenda",
                table: "Meeting",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MeetingProtocolTemplateId",
                table: "Meeting",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Meeting_MeetingProtocolTemplateId",
                table: "Meeting",
                column: "MeetingProtocolTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting",
                column: "MeetingProtocolTemplateId",
                principalTable: "MeetingProtocolTemplate",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.DropIndex(
                name: "IX_Meeting_MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.DropColumn(
                name: "MeetingAgenda",
                table: "Meeting");

            migrationBuilder.DropColumn(
                name: "MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.AddColumn<int>(
                name: "MeetingId",
                table: "MeetingProtocolTemplate",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MeetingProtocolTemplate_MeetingId",
                table: "MeetingProtocolTemplate",
                column: "MeetingId");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingProtocolTemplate_Meeting_MeetingId",
                table: "MeetingProtocolTemplate",
                column: "MeetingId",
                principalTable: "Meeting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
