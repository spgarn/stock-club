using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace club.Controllers
{
    [ApiController]
    [Route("meeting")]
    public class MeetingController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("get/{id}")]
        public async Task<ActionResult<MeetingDTO>> GetMeeting([FromServices] MyDbContext context, int id)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            if (user.Clubs.IsNullOrEmpty()) return NotFound();

            var userClubIds = user.Clubs.Select(c => c.Id).ToList();
            var meeting = await context.Meeting
                .Include(m => m.Attendees)
                .Include(m => m.Decliners) // ✅ Fix: Ensure we load `MeetingDecliners`
                .ThenInclude(d => d.User) // ✅ Fix: Load user info for each decliner
                .Include(m => m.MeetingChats) // ✅ Fix: Ensure `MeetingChats` are loaded
                .ThenInclude(c => c.User) // ✅ Fix: Load users who posted in the chat
                .FirstOrDefaultAsync(x => x.Id == id && userClubIds.Contains(x.Club.Id));

            if (meeting == null) return NotFound();

            return Ok(new MeetingDTO
            {
                Id = meeting.Id,
                Name = meeting.Name,
                Description = meeting.Description,
                MeetingTime = meeting.MeetingTime,
                EndedAt = meeting.EndedAt,
                Location = meeting.Location,
                Agenda = meeting.Agenda,
                MeetingProtocol = meeting.MeetingProtocol,

                // ✅ Fix: Correctly format attendees
                Attendees = meeting.Attendees.Select(user => new UserDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Admin = false
                }).ToList(),

                // ✅ Fix: Correctly format decliners from `MeetingDecliners` table
                Decliners = meeting.Decliners.Select(decliner => new MeetingDeclinerDTO
                {
                    UserId = decliner.UserId,
                    VotingPowerGivenTo = decliner.VotingPowerGivenTo,
                    User = new UserDTO
                    {
                        Id = decliner.User.Id,
                        FirstName = decliner.User.FirstName,
                        LastName = decliner.User.LastName,
                        UserName = decliner.User.UserName,
                        Email = decliner.User.Email,
                        Admin = false
                    }
                }).ToList(),

                // ✅ Fix: Ensure `MeetingChats` are correctly formatted and returned
                MeetingChats = meeting.MeetingChats.Select(chat => new MeetingChatDTO
                {
                    Id = chat.Id,
                    CreatedAt = chat.CreatedAt,
                    Message = chat.Message,
                    UpdatedAt = chat.UpdatedAt,
                    User = new UserDTO
                    {
                        Id = chat.User.Id,
                        FirstName = chat.User.FirstName,
                        LastName = chat.User.LastName,
                        UserName = chat.User.UserName,
                        Email = chat.User.Email,
                        Admin = false
                    }
                }).ToList(),
            });
        }


        [HttpPost]
        [Authorize]
        [Route("{clubId}")]
        public async Task<ActionResult<string>> AddMeeting(AddMeeting meetingDTO,
            [FromServices] MyDbContext context, int clubId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }

            var club = user.Clubs.FirstOrDefault(club => club.Id == clubId);
            if (club == null) return NotFound();

            var meeting = new Meeting
            {
                Name = meetingDTO.Name,
                MeetingTime = meetingDTO.MeetingTime,
                Location = meetingDTO.Location,
                Description = meetingDTO.Description,
                Agenda = meetingDTO.Agenda,
                MeetingProtocol = meetingDTO.MeetingProtocol, //If we have a template selected, paste that over
                Club = club,
            };

            context.Meeting.Add(meeting);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddMeeting), user.Id);
        }

        [HttpPut]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> EditMeeting(AddMeeting meetingDTO,
            [FromServices] MyDbContext context, int id)

        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }

            var meeting = await context.Meeting
                .Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id))
                .FirstOrDefaultAsync();
            if (meeting == null) return NotFound();

            meeting.Name = meetingDTO.Name;
            meeting.MeetingTime = meetingDTO.MeetingTime;
            meeting.Location = meetingDTO.Location;
            meeting.Description = meetingDTO.Description;
            meeting.Agenda = meetingDTO.Agenda;
            meeting.MeetingProtocol = meetingDTO.MeetingProtocol;

            context.Meeting.Update(meeting);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditMeeting), user.Id);
        }

        [HttpPut]
        [Authorize]
        [Route("toggle/{id}")]
        public async Task<ActionResult<string>> ToggleEndMeeting(
            [FromServices] MyDbContext context, int id)

        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            var meeting = await context.Meeting
                .Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id))
                .FirstOrDefaultAsync();
            if (meeting == null) return NotFound();

            if (meeting.EndedAt == null)
            {
                meeting.EndedAt = DateTime.UtcNow;
            }
            else
            {
                meeting.EndedAt = null;
            }

            context.Meeting.Update(meeting);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(ToggleEndMeeting), user.Id);
        }

        [HttpPost]
        [Authorize]
        [Route("{meetingId}/respond")]
        public async Task<IActionResult> RespondToMeeting(int meetingId, [FromBody] RespondToMeetingDto response,
            [FromServices] MyDbContext context)
        {
            var meeting = await context.Meeting
                .Include(m => m.Attendees)
                .Include(m => m.Decliners)
                .ThenInclude(d => d.VotingPowerReceiver) // Ensures we load voting delegates
                .FirstOrDefaultAsync(m => m.Id == meetingId);

            if (meeting == null) return NotFound("Meeting not found.");

            var userResult = await GetCurrentUser(context);
            if (userResult.Value == null) return Unauthorized();
            var user = userResult.Value;

            // ✅ If Attending
            if (response.IsAttending)
            {
                // Add to attendees list if not already present
                if (!meeting.Attendees.Any(u => u.Id == user.Id))
                {
                    meeting.Attendees.Add(user);
                }

                // Remove from Decliners if previously declined
                var existingDecliner = meeting.Decliners.FirstOrDefault(d => d.UserId == user.Id);
                if (existingDecliner != null)
                {
                    meeting.Decliners.Remove(existingDecliner);
                    context.MeetingDecliners.Remove(existingDecliner); // Ensure database consistency
                }
            }
            // ✅ If Declining
            else
            {
                var existingDecliner = meeting.Decliners.FirstOrDefault(d => d.UserId == user.Id);

                // Ensure `VotingPowerGivenTo` is valid if provided
                if (!string.IsNullOrEmpty(response.VotingPowerGivenTo))
                {
                    var delegateUser = meeting.Attendees.FirstOrDefault(a => a.Id == response.VotingPowerGivenTo);
                    if (delegateUser == null)
                    {
                        return BadRequest("Invalid voting power delegate. Must be assigned to an attendee.");
                    }
                }

                if (existingDecliner == null)
                {
                    var newDecliner = new MeetingDecliner
                    {
                        MeetingId = meetingId,
                        UserId = user.Id,
                        VotingPowerGivenTo = response.VotingPowerGivenTo
                    };
                    meeting.Decliners.Add(newDecliner);
                    context.MeetingDecliners.Add(newDecliner);
                }
                else
                {
                    existingDecliner.VotingPowerGivenTo = response.VotingPowerGivenTo;
                }

                // Remove from Attendees if previously marked as attending
                meeting.Attendees.Remove(user);
            }

            await context.SaveChangesAsync();
            return Ok("RSVP updated successfully.");
        }
    }
}