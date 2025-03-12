using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class NewColumnsAttendeesDecliners : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_DeclinersId",
                table: "MeetingDecliners");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingDecliners_Meeting_DeclinedMeetingsId",
                table: "MeetingDecliners");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MeetingDecliners",
                table: "MeetingDecliners");

            migrationBuilder.RenameColumn(
                name: "DeclinersId",
                table: "MeetingDecliners",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "DeclinedMeetingsId",
                table: "MeetingDecliners",
                newName: "MeetingId");

            migrationBuilder.RenameIndex(
                name: "IX_MeetingDecliners_DeclinersId",
                table: "MeetingDecliners",
                newName: "IX_MeetingDecliners_UserId");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "MeetingDecliners",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "VotingPowerGivenTo",
                table: "MeetingDecliners",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MeetingDecliners",
                table: "MeetingDecliners",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingDecliners_MeetingId",
                table: "MeetingDecliners",
                column: "MeetingId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingDecliners_VotingPowerGivenTo",
                table: "MeetingDecliners",
                column: "VotingPowerGivenTo");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_UserId",
                table: "MeetingDecliners",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_VotingPowerGivenTo",
                table: "MeetingDecliners",
                column: "VotingPowerGivenTo",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingDecliners_Meeting_MeetingId",
                table: "MeetingDecliners",
                column: "MeetingId",
                principalTable: "Meeting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_UserId",
                table: "MeetingDecliners");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_VotingPowerGivenTo",
                table: "MeetingDecliners");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingDecliners_Meeting_MeetingId",
                table: "MeetingDecliners");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MeetingDecliners",
                table: "MeetingDecliners");

            migrationBuilder.DropIndex(
                name: "IX_MeetingDecliners_MeetingId",
                table: "MeetingDecliners");

            migrationBuilder.DropIndex(
                name: "IX_MeetingDecliners_VotingPowerGivenTo",
                table: "MeetingDecliners");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "MeetingDecliners");

            migrationBuilder.DropColumn(
                name: "VotingPowerGivenTo",
                table: "MeetingDecliners");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "MeetingDecliners",
                newName: "DeclinersId");

            migrationBuilder.RenameColumn(
                name: "MeetingId",
                table: "MeetingDecliners",
                newName: "DeclinedMeetingsId");

            migrationBuilder.RenameIndex(
                name: "IX_MeetingDecliners_UserId",
                table: "MeetingDecliners",
                newName: "IX_MeetingDecliners_DeclinersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MeetingDecliners",
                table: "MeetingDecliners",
                columns: new[] { "DeclinedMeetingsId", "DeclinersId" });

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingDecliners_AspNetUsers_DeclinersId",
                table: "MeetingDecliners",
                column: "DeclinersId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingDecliners_Meeting_DeclinedMeetingsId",
                table: "MeetingDecliners",
                column: "DeclinedMeetingsId",
                principalTable: "Meeting",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
