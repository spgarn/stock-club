using MailKit.Net.Imap;
using MailKit;
using MailKit.Search;
using MimeKit;

namespace club.Services;

public class EmailFetcher
{
    private readonly string _imapServer = "mailcluster.loopia.se";
    private readonly int _imapPort = 993;

    private readonly string _emailUsername;
    private readonly string _emailPassword;

    public EmailFetcher()
    {
        // Load credentials from environment variables or appsettings.json
        _emailUsername = Environment.GetEnvironmentVariable("IMAP_USERNAME");
        _emailPassword = Environment.GetEnvironmentVariable("IMAP_PASSWORD");

        if (string.IsNullOrEmpty(_emailUsername) || string.IsNullOrEmpty(_emailPassword))
        {
            throw new ApplicationException("IMAP credentials are not set. Please check your configuration.");
        }
    }

    public async Task<List<EmailModel>> GetEmailsAsync(int maxEmails = 10)
    {
        var emails = new List<EmailModel>();

        using (var client = new ImapClient())
        {
            await client.ConnectAsync(_imapServer, _imapPort, true); // SSL enabled

            try
            {
                await client.AuthenticateAsync(_emailUsername, _emailPassword);
            }
            catch (Exception ex)
            {
                throw new ApplicationException("IMAP authentication failed. Check username/password.", ex);
            }

            var inbox = client.Inbox;
            await inbox.OpenAsync(FolderAccess.ReadOnly);

            var uids = await inbox.SearchAsync(SearchQuery.All);
            var latestUids = uids.Reverse().Take(maxEmails);

            foreach (var uid in latestUids)
            {
                var message = await inbox.GetMessageAsync(uid);
                emails.Add(new EmailModel
                {
                    Subject = message.Subject,
                    Body = message.TextBody ?? message.HtmlBody,
                    From = message.From.ToString(),
                    DateReceived = message.Date.UtcDateTime
                });
            }

            await client.DisconnectAsync(true);
        }

        return emails;
    }
}

public class EmailModel
{
    public string Subject { get; set; }
    public string Body { get; set; }
    public string From { get; set; }
    public DateTime DateReceived { get; set; }
}