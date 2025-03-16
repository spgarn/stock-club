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
    [Route("news")]
    public class NewsController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<ActionResult<ICollection<NewsDTO>>> GetNews(
           [FromServices] MyDbContext _context)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var decisions = _context.Decisions.Where(decision => user.Clubs.Select(c => c.Id).Contains(decision.Club.Id)).OrderByDescending(decision => decision.Id).ToArray();

            return Ok(decisions.Select(decision =>
                 new NewsDTO
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
        public async Task<ActionResult<string>> AddNews(
           [FromServices] MyDbContext _context, AddNews news, int clubId)
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
                Title = news.Title,
                Markdown = news.Markdown,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Club = club

            });
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Dtos.AddNews), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> DeleteNews(
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
            return CreatedAtAction(nameof(DeleteNews), user.Id);
        }
    }
}