using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace club.Migrations
{
    /// <inheritdoc />
    public partial class UserClubs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_MyEntities_ClubId",
                table: "Meeting");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingChat_User_UserId",
                table: "MeetingChat");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_MyEntities_ClubId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_User_UserId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_User_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_User_UserId",
                table: "StockHolding");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_UserId",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestion_UserId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropIndex(
                name: "IX_MeetingChat_UserId",
                table: "MeetingChat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MyEntities",
                table: "MyEntities");

            migrationBuilder.RenameTable(
                name: "MyEntities",
                newName: "Club");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "StockHolding",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestionsUpvote",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingsSuggestion",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "MeetingChat",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Club",
                table: "Club",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ApplicationUserClub",
                columns: table => new
                {
                    ClubsId = table.Column<int>(type: "integer", nullable: false),
                    UsersId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserClub", x => new { x.ClubsId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_ApplicationUserClub_AspNetUsers_UsersId",
                        column: x => x.UsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserClub_Club_ClubsId",
                        column: x => x.ClubsId,
                        principalTable: "Club",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_UserId1",
                table: "StockHolding",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId1",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestion_UserId1",
                table: "MeetingsSuggestion",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingChat_UserId1",
                table: "MeetingChat",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserClub_UsersId",
                table: "ApplicationUserClub",
                column: "UsersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_Club_ClubId",
                table: "Meeting",
                column: "ClubId",
                principalTable: "Club",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId1",
                table: "MeetingChat",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId1",
                table: "MeetingsSuggestion",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_Club_ClubId",
                table: "MeetingsSuggestion",
                column: "ClubId",
                principalTable: "Club",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId1",
                table: "StockHolding",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Meeting_Club_ClubId",
                table: "Meeting");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingChat_AspNetUsers_UserId1",
                table: "MeetingChat");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_AspNetUsers_UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestion_Club_ClubId",
                table: "MeetingsSuggestion");

            migrationBuilder.DropForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_AspNetUsers_UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropForeignKey(
                name: "FK_StockHolding_AspNetUsers_UserId1",
                table: "StockHolding");

            migrationBuilder.DropTable(
                name: "ApplicationUserClub");

            migrationBuilder.DropIndex(
                name: "IX_StockHolding_UserId1",
                table: "StockHolding");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropIndex(
                name: "IX_MeetingsSuggestion_UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropIndex(
                name: "IX_MeetingChat_UserId1",
                table: "MeetingChat");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Club",
                table: "Club");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "StockHolding");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingsSuggestionsUpvote");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingsSuggestion");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "MeetingChat");

            migrationBuilder.RenameTable(
                name: "Club",
                newName: "MyEntities");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MyEntities",
                table: "MyEntities",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    HashedPass = table.Column<string>(type: "text", nullable: false),
                    LastLogin = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockHolding_UserId",
                table: "StockHolding",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestionsUpvote_UserId",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingsSuggestion_UserId",
                table: "MeetingsSuggestion",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MeetingChat_UserId",
                table: "MeetingChat",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Meeting_MyEntities_ClubId",
                table: "Meeting",
                column: "ClubId",
                principalTable: "MyEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingChat_User_UserId",
                table: "MeetingChat",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_MyEntities_ClubId",
                table: "MeetingsSuggestion",
                column: "ClubId",
                principalTable: "MyEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestion_User_UserId",
                table: "MeetingsSuggestion",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MeetingsSuggestionsUpvote_User_UserId",
                table: "MeetingsSuggestionsUpvote",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StockHolding_User_UserId",
                table: "StockHolding",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
