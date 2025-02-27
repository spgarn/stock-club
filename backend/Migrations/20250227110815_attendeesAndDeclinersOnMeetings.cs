using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class attendeesAndDeclinersOnMeetings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MeetingAttendees",
                columns: table => new
                {
                    AttendedMeetingsId = table.Column<int>(type: "integer", nullable: false),
                    AttendeesId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingAttendees", x => new { x.AttendedMeetingsId, x.AttendeesId });
                    table.ForeignKey(
                        name: "FK_MeetingAttendees_AspNetUsers_AttendeesId",
                        column: x => x.AttendeesId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingAttendees_Meeting_AttendedMeetingsId",
                        column: x => x.AttendedMeetingsId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MeetingDecliners",
                columns: table => new
                {
                    DeclinedMeetingsId = table.Column<int>(type: "integer", nullable: false),
                    DeclinersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeetingDecliners", x => new { x.DeclinedMeetingsId, x.DeclinersId });
                    table.ForeignKey(
                        name: "FK_MeetingDecliners_AspNetUsers_DeclinersId",
                        column: x => x.DeclinersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MeetingDecliners_Meeting_DeclinedMeetingsId",
                        column: x => x.DeclinedMeetingsId,
                        principalTable: "Meeting",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MeetingAttendees_AttendeesId",
                table: "MeetingAttendees",
                column: "AttendeesId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingDecliners_DeclinersId",
                table: "MeetingDecliners",
                column: "DeclinersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MeetingAttendees");

            migrationBuilder.DropTable(
                name: "MeetingDecliners");
        }
    }
}
