using Microsoft.AspNetCore.Mvc;
using club.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace club.Controllers
{

[ApiController]
[Route("emails")]
public class EmailController : Controller
{
    private readonly EmailFetcher _emailFetcher;

    public EmailController()
    {
        _emailFetcher = new EmailFetcher(); // No DI needed for now
    }

    [HttpGet]
    public async Task<IActionResult> GetEmails()
    {
        var emails = await _emailFetcher.GetEmailsAsync();
        return Ok(emails);
    }
}
}