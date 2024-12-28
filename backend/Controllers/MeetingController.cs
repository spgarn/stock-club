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
        public async Task<ActionResult<String>> GetMeeting(
     [FromServices] MyDbContext _context, int id)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }
            var userClubIds = user.Clubs.Select(c => c.Id).ToList();
            var meeting = await _context.Meeting
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
        public async Task<ActionResult<String>> AddMeeting(AddMeeting meetingDTO,
           [FromServices] MyDbContext _context, int clubId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }

            var club = user.Clubs.Where(club => club.Id == clubId).FirstOrDefault();
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

            _context.Meeting.Add(meeting);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddMeeting), user.Id);
        }
        [HttpPut]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<String>> EditMeeting(AddMeeting meetingDTO,
           [FromServices] MyDbContext _context, int id)

        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }

            var meeting = await _context.Meeting.Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id)).FirstOrDefaultAsync();
            if (meeting == null) return NotFound();

            meeting.Name = meetingDTO.Name;
            meeting.MeetingTime = meetingDTO.MeetingTime;
            meeting.Location = meetingDTO.Location;
            meeting.Description = meetingDTO.Description;
            meeting.Agenda = meetingDTO.Agenda;
            meeting.MeetingProtocol = meetingDTO.MeetingProtocol;

            _context.Meeting.Update(meeting);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditMeeting), user.Id);
        }

        [HttpPut]
        [Authorize]
        [Route("toggle/{id}")]
        public async Task<ActionResult<String>> ToggleEndMeeting(
          [FromServices] MyDbContext _context, int id)

        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var meeting = await _context.Meeting.Where(meeting => meeting.Id == id && user.Clubs.Select(c => c.Id).Contains(meeting.Club.Id)).FirstOrDefaultAsync();
            if (meeting == null) return NotFound();

            if (meeting.EndedAt == null)
            {
                meeting.EndedAt = DateTime.UtcNow;
            }
            else
            {
                meeting.EndedAt = null;
            }

            _context.Meeting.Update(meeting);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(ToggleEndMeeting), user.Id);
        }
    }
}