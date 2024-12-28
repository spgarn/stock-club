using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class NullableMeetingProtocol : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.AlterColumn<int>(
                name: "MeetingProtocolTemplateId",
                table: "Meeting",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting",
                column: "MeetingProtocolTemplateId",
                principalTable: "MeetingProtocolTemplate",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting");

            migrationBuilder.AlterColumn<int>(
                name: "MeetingProtocolTemplateId",
                table: "Meeting",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_MeetingProtocolTemplate_MeetingProtocolTemplateId",
                table: "Meeting",
                column: "MeetingProtocolTemplateId",
                principalTable: "MeetingProtocolTemplate",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
