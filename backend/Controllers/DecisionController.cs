using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace club.Controllers
{
    [ApiController]
    [Route("decisions")]
    public class DecisionController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<ActionResult<ICollection<DecisionDTO>>> GetDecisions(
           [FromServices] MyDbContext _context)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var decisions = _context.Decisions.Where(decision => user.Clubs.Select(c => c.Id).Contains(decision.Club.Id)).OrderByDescending(decision => decision.Id).ToArray();

            return Ok(decisions.Select(decision =>
                 new DecisionDTO
                 {
                     Id = decision.Id,
                     Title = decision.Title,
                     Markdown = decision.Markdown,
                     CreatedAt = decision.CreatedAt,
                     UpdatedAt = decision.UpdatedAt
                 }).ToList());
        }
        [HttpPost]
        [Authorize]
        [Route("add/{clubId}")]
        public async Task<ActionResult<string>> AddDecision(
           [FromServices] MyDbContext _context, AddDecision decision, int clubId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();
            var club = user.Clubs.Where(club => club.Id == clubId).FirstOrDefault();
            if (club == null) return NotFound();
            _context.Decisions.Add(new Decisions
            {
                Title = decision.Title,
                Markdown = decision.Markdown,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Club = club

            });
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddDecision), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> DeleteDecision(
          [FromServices] MyDbContext _context, int id)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();
            var club = user.Clubs.First(); //For now just select the first club

            var decision = await _context.Decisions.Where(decision => decision.Id == id && user.Clubs.Select(c => c.Id).Contains(decision.Club.Id)).FirstOrDefaultAsync();
            if (decision == null) return NotFound();
            _context.Decisions.Remove(decision);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(DeleteDecision), user.Id);
        }
    }
}