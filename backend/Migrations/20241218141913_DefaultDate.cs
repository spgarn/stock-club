using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class DefaultDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "MeetingsSuggestion",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote");

            migrationBuilder.AlterColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestionsDownvote",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "MeetingsSuggestion",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValueSql: "NOW()");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsDownvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsDownvote",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
