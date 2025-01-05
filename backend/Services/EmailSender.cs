using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace club.Services;

public class EmailSender : IEmailSender
{
    private readonly ILogger _logger;

    public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor,
        ILogger<EmailSender> logger)
    {
        Options = optionsAccessor.Value;
        _logger = logger;
    }

    public AuthMessageSenderOptions Options { get; } //Set with Secret Manager.

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        if (string.IsNullOrEmpty(Options.SendGridKey))
        {
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new ApplicationException("SENDGRID_API_KEY environment variable is not set");
            }
            Options.SendGridKey = apiKey;
        }
        await Execute(Options.SendGridKey, subject, message, toEmail);
    }
    
    public async Task ExecuteGeneric(string apiKey, string subject, string plainTextContent, string htmlContent, string toEmail)
    {
        var client = new SendGridClient(apiKey);
        var msg = new SendGridMessage()
        {
            From = new EmailAddress("klubbportalen@outlook.com", "Password Recovery"),
            Subject = subject,
            PlainTextContent = plainTextContent,
            HtmlContent = htmlContent
        };
        msg.AddTo(new EmailAddress(toEmail));

        // Disable click tracking.
        msg.SetClickTracking(false, false);
        var response = await client.SendEmailAsync(msg);
        var responseBody = await response.Body.ReadAsStringAsync();
        _logger.LogInformation($"SendGrid Response StatusCode: {response.StatusCode}");
        _logger.LogInformation($"SendGrid Response Body: {responseBody}");
    }

    public async Task Execute(string apiKey, string subject, string message, string toEmail)
    {
        var client = new SendGridClient(apiKey);
        var msg = new SendGridMessage()
        {
            From = new EmailAddress("klubbportalen@outlook.com", "Password Recovery"),
            Subject = subject,
            PlainTextContent = message,
            HtmlContent = message
        };
        Console.WriteLine("Trying to send mail");
        msg.AddTo(new EmailAddress(toEmail));

        // Disable click tracking.
        // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
        msg.SetClickTracking(false, false);
        var response = await client.SendEmailAsync(msg);
        var responseBody = await response.Body.ReadAsStringAsync();
        _logger.LogInformation($"SendGrid Response StatusCode: {response.StatusCode}");
        _logger.LogInformation($"SendGrid Response Body: {responseBody}");
        // _logger.LogInformation(response.IsSuccessStatusCode
        //     ? $"Email to {toEmail} queued successfully!"
        //     : $"Failure Email to {toEmail}");
    }
}