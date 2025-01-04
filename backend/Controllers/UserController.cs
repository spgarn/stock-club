using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace club.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ExtendedController
    {

        [HttpGet]
        [Authorize]
        [Route("info")]
        public async Task<ActionResult<UserDTO>> GetUser([FromServices] MyDbContext context, [FromServices] UserManager<ApplicationUser> userManager)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            var roles = await userManager.GetRolesAsync(user);
            return Ok(new UserDTO
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                UserName = user.UserName,
                Clubs = user.Clubs.Select(club =>
                 new ClubDto
                 {
                     Id = club.Id,
                     Name = club.Name
                 }).ToList(),
                Admin = roles.Contains("Admin")
            });
        }
        
        [HttpGet]
        [Authorize]
        [Route("{userId}/info")]
        public async Task<ActionResult<UserDTO>> GetUser([FromServices] MyDbContext context, [FromServices] UserManager<ApplicationUser> userManager, string userId)
        {
            var result = await GetCurrentUser(context);
            if (result.Result != null) // If it's an error result
                return result.Result;
            if (result.Value == null) return NotFound();
            var user = result.Value;
            var infoUser = await context.Users //Get the user if ID matches and they share at least one club
                .Include(u => u.Clubs)
                .FirstOrDefaultAsync(u => u.Id == userId && u.Clubs.Count(club => user.Clubs.Contains(club)) > 0);
            if (infoUser == null) return NotFound();
            return Ok(new UserDTO
            {
                Email = infoUser.Email,
                FirstName = infoUser.FirstName,
                LastName = infoUser.LastName,
                Id = infoUser.Id,
                UserName = infoUser.UserName,
                Clubs = infoUser.Clubs.Select(club =>
                    new ClubDto
                    {
                        Id = club.Id,
                        Name = club.Name
                    }).ToList(),
                Admin =false
            });
        }
    }
}