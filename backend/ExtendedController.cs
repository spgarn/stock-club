using club.Data;
using club.Models;
using k8s.KubeConfigModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace club
{
    public abstract class ExtendedController : ControllerBase
    {
        protected async Task<ActionResult<ApplicationUser>> GetCurrentUser(MyDbContext context)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await context.Users
                .Include(u => u.Clubs)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
    }
}
