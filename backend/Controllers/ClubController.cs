using club.Data;
using club.Dtos;
using club.Models;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Security.Claims;

namespace club.Controllers
{
    [ApiController]
    [Route("club")]
    public class ClubController : ExtendedController
    {
        // GET: /club
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Club>>> GetUserClubs(
            [FromServices] MyDbContext context)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            return Ok(user.Clubs.Select(club => new ClubDto
            {
                Id = club.Id,
                Name = club.Name,
                PublicInvestments = club.PublicInvestments,
            }).ToList());
        }

        [HttpGet]
        [Authorize]
        [Route("{id}/info")]
        public async Task<ActionResult<IEnumerable<ClubDto>>> GetClubSuggestions(int id,
            [FromServices] MyDbContext context)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;

            // Fetch the club and its users, suggestions, meetings
            var club = await context.Club
                .Include(u => u.Users)
                .Include(u => u.Meetings)
                .ThenInclude(m => m.Attendees)
                .Include(u => u.Meetings)
                .ThenInclude(m => m.Decliners)
                .Include(u => u.MeetingsSuggestions)
                .ThenInclude(ms => ms.Meeting)
                .Include(u => u.MeetingsSuggestions)
                .ThenInclude(ms => ms.MeetingsSuggestionsUpvotes)
                .Include(u => u.MeetingsSuggestions)
                .ThenInclude(ms => ms.MeetingsSuggestionsDownvotes)
                .FirstOrDefaultAsync(c => c.Id == id);

            //If there is no club by the given ID, not found.
            if (club == null)
            {
                return NotFound();
            }

            //Order
            club.Meetings = club.Meetings.OrderByDescending(m => m.MeetingTime).ToList();
            club.MeetingsSuggestions = club.MeetingsSuggestions.OrderByDescending(ms => ms.Id).ToList();
            //Try to find the current userId in the list of users. If it can't be found user is not part of this club
            var userRef = club.Users.FirstOrDefault(u => u.Id == user.Id);
            if (userRef == null)
            {
                return Unauthorized();
            }

            var clubDto = new ClubDto
            {
                Id = club.Id,
                Name = club.Name,
                PublicInvestments = club.PublicInvestments,

                // Convert each Meeting entity to a MeetingDTO
                Meetings = club.Meetings.Select(meeting => new MeetingDTO
                {
                    Id = meeting.Id,
                    Name = meeting.Name,
                    Description = meeting.Description,
                    MeetingTime = meeting.MeetingTime,
                    EndedAt = meeting.EndedAt,
                    Location = meeting.Location,
                    Agenda = meeting.Agenda,
                    MeetingProtocol = meeting.MeetingProtocol,
                    Attendees = meeting.Attendees.Select(u => new UserDTO
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email ?? "",
                        UserName = u.UserName ?? ""
                    }).ToList(),
                    Decliners = meeting.Decliners.Select(u => new UserDTO
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Email = u.Email ?? "",
                        UserName = u.UserName ?? ""
                    }).ToList()

                    // If you need to map meeting chats, do so here:
                    // MeetingChats = meeting.MeetingChats.Select(chat => new MeetingChatDTO { ... }).ToList()
                }).ToList(),

                // Convert each MeetingsSuggestion entity to a MeetingSuggestionDTO
                MeetingsSuggestions = club.MeetingsSuggestions.Select(suggestion =>
                    new MeetingSuggestionDTO
                    {
                        Id = suggestion.Id,
                        Title = suggestion.Title,
                        Description = suggestion.Description,
                        CreatedAt = suggestion.CreatedAt,
                        Completed = suggestion.Completed,

                        // Instead of assigning the EF Meeting entity directly,
                        // map it to a new MeetingDTO to avoid circular references
                        Meeting = suggestion.Meeting == null
                            ? null
                            : new MeetingDTO
                            {
                                Id = suggestion.Meeting.Id,
                                Name = suggestion.Meeting.Name,
                                Description = suggestion.Meeting.Description,
                                MeetingTime = suggestion.Meeting.MeetingTime,
                                EndedAt = suggestion.Meeting.EndedAt,
                                Location = suggestion.Meeting.Location,
                                Agenda = suggestion.Meeting.Agenda,
                                MeetingProtocol = suggestion.Meeting.MeetingProtocol
                            },

                        User = new UserDTO
                        {
                            Id = suggestion.User.Id,
                            FirstName = suggestion.User.FirstName,
                            LastName = suggestion.User.LastName,
                            Email = suggestion.User.Email ?? "",
                            UserName = suggestion.User.UserName ?? ""
                        },

                        MeetingsSuggestionsUpvotes = suggestion.MeetingsSuggestionsUpvotes
                            .Select(upvote => new MeetingSuggestionUpvoteDTO
                            {
                                Id = upvote.Id,
                                UserId = upvote.User.Id
                            }).ToList(),

                        MeetingsSuggestionsDownvotes = suggestion.MeetingsSuggestionsDownvotes
                            .Select(downvote => new MeetingSuggestionDownvoteDTO
                            {
                                Id = downvote.Id,
                                UserId = downvote.User.Id
                            }).ToList()
                    }
                ).ToList()
            };


            return Ok(clubDto);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("edit/{clubId}")]
        public async Task<ActionResult<string>> EditClub(
            [FromServices] MyDbContext context, EditClubForm data, int clubId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            var activeClub = user.Clubs.FirstOrDefault(club => club.Id == clubId);
            if (activeClub == null) return NotFound();
            activeClub.Name = data.Name;
            activeClub.PublicInvestments = data.PublicInvestments;
            context.Club.Update(activeClub);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditClub), user.Id);
        }

        [HttpPost]
        [Authorize]
        [Route("suggestion/{clubId}/{meetingId}")]
        public async Task<ActionResult<string>> AddProposal(AddSuggestion suggestionDTO,
            [FromServices] MyDbContext context, int clubId, int meetingId)
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

            var meeting = context.Meeting.FirstOrDefault(meeting => meeting.Id == meetingId && meeting.Club == club);
            if (meeting == null) return NotFound();

            var meetingSuggestion = new MeetingsSuggestion();
            meetingSuggestion.Title = suggestionDTO.Title;
            meetingSuggestion.Description = suggestionDTO.Description;
            meetingSuggestion.Club = club;
            meetingSuggestion.User = user;
            meetingSuggestion.Meeting = meeting;

            context.MeetingsSuggestion.Add(meetingSuggestion);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddProposal), user.Id);
        }

        [HttpPost]
        [Authorize]
        [Route("togglesuggestion/{suggestionId}")]
        public async Task<ActionResult<string>> ToggleSuggestionComplete(
            [FromServices] MyDbContext context, int suggestionId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound();
            }

            var meetingSuggestion = context.MeetingsSuggestion.FirstOrDefault(m =>
                m.Id == suggestionId && user.Clubs.Select(c => c.Id).Contains(m.Club.Id));
            if (meetingSuggestion == null) return NotFound();
            meetingSuggestion.Completed = !meetingSuggestion.Completed;
            context.MeetingsSuggestion.Update(meetingSuggestion);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(ToggleSuggestionComplete), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("suggestion/delete/{suggestionid}")]
        public async Task<ActionResult<String>> RemoveProposal(
            [FromServices] MyDbContext _context, int suggestionid)
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

            var meetingSuggestion = _context.MeetingsSuggestion
                .Where(sugg => sugg.Id == suggestionid && user.Clubs.Select(c => c.Id).Contains(sugg.Club.Id))
                .FirstOrDefault();
            if (meetingSuggestion == null) return NotFound();

            _context.MeetingsSuggestion.Remove(meetingSuggestion);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(RemoveProposal), user.Id);
        }

        [HttpPost]
        [Authorize]
        [Route("react")]
        public async Task<ActionResult<String>> ProposalReact(React reactDTO,
            [FromServices] MyDbContext _context)
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

            //Check if user is in the same club as the suggestion
            var suggestion = await _context.MeetingsSuggestion
                .Include(s => s.Club)
                .Where(sugg => sugg.Id == reactDTO.SuggestionId)
                .Where(sugg => user.Clubs.Select(c => c.Id).Contains(sugg.Club.Id))
                .FirstOrDefaultAsync();

            if (suggestion == null)
            {
                return NotFound();
            }

            //Delete previous reacts on this suggestion by this user
            var upvotes = await _context.MeetingsSuggestionsUpvote
                .Where(react => react.MeetingsSuggestion.Id == suggestion.Id && react.User.Id == user.Id)
                .ToListAsync();
            var downvotes = await _context.MeetingsSuggestionsDownvote
                .Where(react => react.MeetingsSuggestion.Id == suggestion.Id && react.User.Id == user.Id)
                .ToListAsync();

            _context.MeetingsSuggestionsUpvote.RemoveRange(upvotes);
            _context.MeetingsSuggestionsDownvote.RemoveRange(downvotes);
            //Add react
            if (reactDTO.IsUpvote)
            {
                if (upvotes.Count ==
                    0) //We only want to add if it doesn't already exist. If it exists, this is a DELETE operation
                {
                    _context.MeetingsSuggestionsUpvote.Add(new MeetingsSuggestionsUpvote
                    {
                        User = user,
                        MeetingsSuggestion = suggestion
                    });
                }
            }
            else
            {
                if (downvotes.Count ==
                    0) // We only want to add if it doesn't already exist. If it exists, this is a DELETE operation
                {
                    _context.MeetingsSuggestionsDownvote.Add(new MeetingsSuggestionsDownvote
                    {
                        User = user,
                        MeetingsSuggestion = suggestion
                    });
                }
            }

            await _context.SaveChangesAsync();


            //Respond
            return CreatedAtAction(nameof(ProposalReact), user.Id);
        }

        // GET: /club/admin
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        //[Authorize]
        public String AdminOs()
        {
            return "pong";
        }
    }
}