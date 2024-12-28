using club.Dtos;
using club.Models;
using k8s.KubeConfigModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace club.Controllers
{
    [ApiController]
    [Route("")]
    public class HomeController : Controller
    {
        // GET: HomeController
        [HttpGet("ping")]
        public String Index()
        {
            return "pong";
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterForm input, [FromServices] IServiceProvider sp)
        {
            var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();
            var userStore = sp.GetRequiredService<IUserStore<ApplicationUser>>();
            var emailStore = (IUserEmailStore<ApplicationUser>)userStore;

            // Validate email
            if (string.IsNullOrEmpty(input.Email) || !new EmailAddressAttribute().IsValid(input.Email))
            {
                return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(input.Email)));
            }

            // Validate username
            //if (string.IsNullOrEmpty(input.UserName))
            //{
            //    return CreateValidationProblem(IdentityResult.Failed(
            //        new IdentityError
            //        {
            //            Code = "UserNameRequired",
            //            Description = "Username is required."
            //        }
            //    ));
            //}

            // Validate first name and last name (optional, you can adjust as needed)
            if (string.IsNullOrEmpty(input.FirstName))
            {
                return CreateValidationProblem(IdentityResult.Failed(
                    new IdentityError
                    {
                        Code = "FirstNameRequired",
                        Description = "First name is required."
                    }
                ));
            }

            if (string.IsNullOrEmpty(input.LastName))
            {
                return CreateValidationProblem(IdentityResult.Failed(
                    new IdentityError
                    {
                        Code = "LastNameRequired",
                        Description = "Last name is required."
                    }
                ));
            }

            var user = new ApplicationUser()
            {
                FirstName = input.FirstName,
                LastName = input.LastName,
                Email = input.Email,
                UserName = input.Email, //Because ASP uses userName for login not mail -_-
            };

            // Set username and email
            //await userStore.SetUserNameAsync(user, input.UserName, CancellationToken.None);
            await ((IUserEmailStore<ApplicationUser>)userStore).SetEmailAsync(user, input.Email, CancellationToken.None);

            // Create user
            var result = await userManager.CreateAsync(user, input.Password);

            // Check result
            if (!result.Succeeded)
            {
                return CreateValidationProblem(result);
            }

            return Ok("User created successfully");
        }

        // Helper method to create validation problem
        private IActionResult CreateValidationProblem(IdentityResult result)
        {
            var errors = result.Errors.Select(e => new { Code = e.Code, Description = e.Description });

            return ValidationProblem(new ValidationProblemDetails
            {
                Status = StatusCodes.Status400BadRequest,
                Errors = errors.ToDictionary(e => e.Code, e => new[] { e.Description })
            });
        }

    }
}
