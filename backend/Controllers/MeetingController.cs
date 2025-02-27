using club.Data;
using club.Dtos;
using club.Migrations;
using club.Models;
using k8s.KubeConfigModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;

namespace club.Controllers
{
    [ApiController]
    [Route("meeting")]
    public class MeetingController : ExtendedController
    {

        [HttpGet]
        [Authorize]
        [Route("get/{id}")]
        public async Task<ActionResult<string>> GetMeeting(
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
            var userClubIds = user.Clubs.Select(c => c.Id).ToList();
            var meeting = await context.Meeting
                .Include(v => v.MeetingChats)
                .ThenInclude(v => v.User)
                .FirstOrDefaultAsync(x => x.Id == id && userClubIds.Contains(x.Club.Id));
            if (meeting == null)
            {
                return NotFound();
            }
            return Ok(new MeetingDTO
            {
                Id = meeting.Id,
                Description = meeting.Description,
                Location = meeting.Location,
                MeetingTime = meeting.MeetingTime,
                EndedAt = meeting.EndedAt,
                Name = meeting.Name,
                Agenda = meeting.Agenda,
                MeetingProtocol = meeting.MeetingProtocol,
                MeetingChats = meeting.MeetingChats.Select(chat => new MeetingChatDTO
                {
                    Id = chat.Id,
                    CreatedAt = chat.CreatedAt,
                    Message = chat.Message,
                    UpdatedAt = chat.UpdatedAt,
                    User = new UserDTO
                    {
                        Id = user.Id,
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

            var meeting = await context.Meeting.Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id)).FirstOrDefaultAsync();
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

            var meeting = await context.Meeting.Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id)).FirstOrDefaultAsync();
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
        public async Task<IActionResult> RespondToMeeting(int meetingId, [FromBody] RespondToMeetingDto response, [FromServices] MyDbContext context)
        {
            // Load the meeting with both Attendees and Decliners
            var meeting = await context.Meeting
                .Include(m => m.Attendees)
                .Include(m => m.Decliners)
                .FirstOrDefaultAsync(m => m.Id == meetingId);

            if (meeting == null)
            {
                return NotFound("Meeting not found.");
            }

            var userResult = await GetCurrentUser(context);
            if (userResult.Value == null)
            {
                return Unauthorized();
            }
            var user = userResult.Value;

            if (response.IsAttending)
            {
                // If attending, ensure the user is in the Attendees list.
                if (!meeting.Attendees.Any(u => u.Id == user.Id))
                {
                    meeting.Attendees.Add(user);
                }
                // Remove the user from Decliners if they were previously marked as declining.
                if (meeting.Decliners.Any(u => u.Id == user.Id))
                {
                    meeting.Decliners.Remove(user);
                }
            }
            else
            {
                // If declining, ensure the user is in the Decliners list.
                if (!meeting.Decliners.Any(u => u.Id == user.Id))
                {
                    meeting.Decliners.Add(user);
                }
                // Remove the user from Attendees if they were previously marked as attending.
                if (meeting.Attendees.Any(u => u.Id == user.Id))
                {
                    meeting.Attendees.Remove(user);
                }
            }

            await context.SaveChangesAsync();
            return Ok("RSVP updated successfully.");
        }
    }
}