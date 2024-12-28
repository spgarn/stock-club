using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
            ApplicationUser user = result.Value;
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
    }
}