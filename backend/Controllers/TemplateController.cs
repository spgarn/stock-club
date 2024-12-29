using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace club.Controllers
{
    [ApiController]
    [Route("templates")]
    public class TemplateController : ExtendedController
    {
        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<ActionResult<ICollection<TemplateDTO>>> GetProtocols(
           [FromServices] MyDbContext _context)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var protocols = _context.ClubTemplates.Where(template => user.Clubs.Select(c => c.Id).Contains(template.Club.Id)).OrderByDescending(template => template.Id).ToArray();

            return Ok(protocols.Select(protocol =>
                 new TemplateDTO
                 {
                     Id = protocol.Id,
                     Title = protocol.Title,
                     Markdown = protocol.Markdown,
                     CreatedAt = protocol.CreatedAt,
                     UpdatedAt = protocol.UpdatedAt
                 }).ToList());
        }
        [HttpPost]
        [Authorize]
        [Route("add/{clubId}")]
        public async Task<ActionResult<string>> AddProtocol(
           [FromServices] MyDbContext _context, AddTemplate protocol, int clubId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();
            var club = user.Clubs.Where(club => club.Id == clubId).FirstOrDefault();
            if (club == null) return NotFound();
            _context.ClubTemplates.Add(new ClubTemplates
            {
                Title = protocol.Title,
                Markdown = protocol.Markdown,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Club = club

            });
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddProtocol), user.Id);
        }
        [HttpPut]
        [Authorize]
        [Route("edit")]
        public async Task<ActionResult<string>> EditProtocol(
           [FromServices] MyDbContext _context, EditTemplate protocol)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();

            var meetingProtocol = await _context.ClubTemplates.Where(template => template.Id == protocol.Id && user.Clubs.Select(c => c.Id).Contains(template.Club.Id)).FirstOrDefaultAsync();
            if (meetingProtocol == null) return NotFound();
            meetingProtocol.Title = protocol.Title;
            meetingProtocol.Markdown = protocol.Markdown;
            meetingProtocol.UpdatedAt = DateTime.UtcNow;
            _context.ClubTemplates.Update(meetingProtocol);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(EditProtocol), user.Id);
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public async Task<ActionResult<string>> DeleteProtocol(
          [FromServices] MyDbContext _context, int id)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            if (user.Clubs.Count == 0) return NotFound();
            var meetingProtocol = await _context.ClubTemplates.Where(template => template.Id == id && user.Clubs.Select(c => c.Id).Contains(template.Club.Id)).FirstOrDefaultAsync();
            if (meetingProtocol == null) return NotFound();
            _context.ClubTemplates.Remove(meetingProtocol);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(DeleteProtocol), user.Id);
        }
    }
}