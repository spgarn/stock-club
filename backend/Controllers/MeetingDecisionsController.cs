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
    [Route("meeting_decisions")]
    public class MeetingDecisionsController : ExtendedController
    {

        [HttpPost]
        [Authorize]
        [Route("add/{clubId}/{meetingId}")]
        public async Task<ActionResult<string>> AddDecision(AddDecision decisionDTO,
            [FromServices] MyDbContext context, int clubId, int meetingId)
        {
            var result = await GetCurrentUser(context);

            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound("Could not find user");
            var user = result.Value;

            if (user.Clubs.IsNullOrEmpty())
            {
                return NotFound("No Club Selected");
            }

            var club = user.Clubs.FirstOrDefault(club => club.Id == clubId);
            if (club == null) return NotFound("No Club Found");

            var meeting = context.Meeting.FirstOrDefault(meeting => meeting.Id == meetingId && meeting.Club == club);
            if (meeting == null) return NotFound("Meeting Not Found");

            var meetingDecision = new MeetingsDecisions();
            meetingDecision.Title = decisionDTO.Title;
            meetingDecision.ExpiresAt = DateTime.UtcNow.AddSeconds(decisionDTO.TimeUntilExpiry);
            meetingDecision.CreatedAt = DateTime.UtcNow;
            meetingDecision.Club = club;
            meetingDecision.User = user;
            meetingDecision.Meeting = meeting;

            context.MeetingsDecisions.Add(meetingDecision);
            await context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddDecision), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("delete/{decisionid}")]
        public async Task<ActionResult<String>> RemoveDecision(
            [FromServices] MyDbContext _context, int decisionid)
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

            var meetingDecision = _context.MeetingsDecisions
                .FirstOrDefault(sugg => sugg.Id == decisionid && user.Clubs.Select(c => c.Id).Contains(sugg.Club.Id));
            if (meetingDecision == null) return NotFound();

            _context.MeetingsDecisions.Remove(meetingDecision);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(RemoveDecision), user.Id);
        }

        [HttpPost]
        [Authorize]
        [Route("react")]
        public async Task<ActionResult<String>> DecisionReact(ReactDecision reactDTO,
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

            //Check if user is in the same club as the decision
            var decision = await _context.MeetingsDecisions
                .Include(s => s.Club)
                .Where(sugg => sugg.Id == reactDTO.DecisionId)
                .Where(sugg => user.Clubs.Select(c => c.Id).Contains(sugg.Club.Id))
                .FirstOrDefaultAsync();

            if (decision == null)
            {
                return NotFound();
            }

            //Delete previous reacts on this decision by this user
            var upvotes = await _context.MeetingsDecisionsUpvote
                .Where(react => react.MeetingsDecisions.Id == decision.Id && react.User.Id == user.Id)
                .ToListAsync();
            var downvotes = await _context.MeetingsDecisionsDownvote
                .Where(react => react.MeetingsDecisions.Id == decision.Id && react.User.Id == user.Id)
                .ToListAsync();

            _context.MeetingsDecisionsUpvote.RemoveRange(upvotes);
            _context.MeetingsDecisionsDownvote.RemoveRange(downvotes);
            //Add react
            if (reactDTO.IsUpvote)
            {
                if (upvotes.Count ==
                    0) //We only want to add if it doesn't already exist. If it exists, this is a DELETE operation
                {
                    _context.MeetingsDecisionsUpvote.Add(new MeetingsDecisionsUpvote
                    {
                        User = user,
                        MeetingsDecisions = decision
                    });
                }
            }
            else
            {
                if (downvotes.Count ==
                    0) // We only want to add if it doesn't already exist. If it exists, this is a DELETE operation
                {
                    _context.MeetingsDecisionsDownvote.Add(new MeetingsDecisionsDownvote
                    {
                        User = user,
                        MeetingsDecisions = decision
                    });
                }
            }

            await _context.SaveChangesAsync();


            //Respond
            return CreatedAtAction(nameof(DecisionReact), user.Id);
        }
    }
}