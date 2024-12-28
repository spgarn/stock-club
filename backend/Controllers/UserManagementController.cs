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
    [Route("usermanagement")]
    public class UserManagementController : ExtendedController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("all_not_in_club/{clubId}")]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAllUsersNotInClub([FromServices] MyDbContext context, int clubId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var activeClub = user.Clubs.Where(Club => Club.Id == clubId).FirstOrDefault();
            if (activeClub == null) return NotFound();

            var users = context.Users.Where(dbUser => dbUser.Clubs.Where(userClub => activeClub.Id == userClub.Id).Count() == 0).OrderByDescending(user => user.Id).ToArray();

            return Ok(users.Select(user => new UserDTO
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                UserName = user.UserName,
            }));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("all_in_club/{clubId}")]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAllUsersInClub([FromServices] MyDbContext context, int clubId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;

            var activeClub = user.Clubs.Where(Club => Club.Id == clubId).FirstOrDefault();
            if (activeClub == null) return NotFound();

            var users = context.Users.Where(dbUser => dbUser.Clubs.Where(userClub => activeClub.Id == userClub.Id).Count() > 0).OrderByDescending(user => user.Id).ToArray();

            return Ok(users.Select(user => new UserDTO
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                UserName = user.UserName,
                Admin = false
            }));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("add/{clubId}")]
        public async Task<ActionResult<string>> AddUser(
           [FromServices] MyDbContext _context, AddUser data, int clubId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            var activeClub = user.Clubs.Where(Club => Club.Id == clubId).FirstOrDefault();
            if (activeClub == null) return NotFound();

            var newUser = await _context.Users.Where(dbUser => dbUser.Email == data.email && dbUser.Clubs.Where(userClub => activeClub.Id == userClub.Id).Count() == 0).FirstOrDefaultAsync();
            if (newUser == null)
            {
                return NotFound();
            }
            newUser.Clubs.Add(activeClub);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddUser), user.Id);
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("{clubId}/userid/{userId}")]
        public async Task<ActionResult<string>> RemoveUser(
           [FromServices] MyDbContext _context, int clubId, string userId)
        {
            var result = await GetCurrentUser(_context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            ApplicationUser user = result.Value;
            var activeClub = user.Clubs.Where(Club => Club.Id == clubId).FirstOrDefault();
            if (activeClub == null) return NotFound();

            var newUser = await _context.Users.Include(user => user.Clubs).Where(dbUser => dbUser.Id == userId && dbUser.Clubs.Where(userClub => activeClub.Id == userClub.Id).Count() > 0).FirstOrDefaultAsync();
            if (newUser == null)
            {
                return NotFound();
            }
            System.Diagnostics.Debug.WriteLine(activeClub);
            System.Diagnostics.Debug.WriteLine(newUser.Clubs.Count());
            var answer = newUser.Clubs.Remove(activeClub);
            if (!answer)
            {
                return StatusCode(500);
            }
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(RemoveUser), user.Id);
        }
    }
}