using club.Data;
using club.Dtos;
using club.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace club.Hubs
{
    [Authorize]
    public class MeetingHub(IMemoryCache cache, MyDbContext context) : Hub
    {
        private readonly IMemoryCache _cache = cache;
        private readonly MyDbContext _context = context;

        public async Task JoinRoom(int clubId, int meetingId)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            var user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new HubException("User not found.");
            }

            // Fetch the meeting from the database

            if (user == null)
            {
                throw new HubException("User Not Found");
            }
            var club = user.Clubs.Where(club => club.Id == clubId).First(); //Grab club
            if (club == null)
            {
                throw new HubException("Club Not Found");

            }
            var meeting = await _context.Meeting.Where(meeting => meeting.Club.Id == club.Id && meeting.Id == meetingId).FirstOrDefaultAsync();
            if (meeting == null)
            {
                throw new HubException("Meeting not found.");
            }
            await Groups.AddToGroupAsync(Context.ConnectionId, meeting.Id.ToString()); //Passed all validation checks
        }

        public async Task LeaveRoom(int meetingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingId.ToString()); //As it's only leaving we don't need to do checks
        }

        public async Task Agenda(int meetingId, string msg)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            // Try to get from cache
            if (!_cache.TryGetValue(userId, out ApplicationUser? user))
            {
                // Fetch from DB if not in cache
                user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    throw new HubException("User not found.");
                }

                // Set cache with expiration
                _cache.Set(userId, user, TimeSpan.FromMinutes(30)); // Adjust expiration as needed
            }
            await Clients.Group(meetingId.ToString()).SendAsync("Agenda", msg);
        }

        public async Task MeetingProtocol(int meetingId, string msg)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            // Try to get from cache
            if (!_cache.TryGetValue(userId, out ApplicationUser? user))
            {
                // Fetch from DB if not in cache
                user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    throw new HubException("User not found.");
                }

                // Set cache with expiration
                _cache.Set(userId, user, TimeSpan.FromMinutes(30)); // Adjust expiration as needed
            }
            await Clients.Group(meetingId.ToString()).SendAsync("MeetingProtocol", msg);
        }

        public async Task<MeetingChatDTO?> SendChat(int clubId, int meetingId, string msg)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            var user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new HubException("User not found.");
            }

            // Fetch the meeting from the database

            if (user == null)
            {
                throw new HubException("User Not Found");
            }
            var club = user.Clubs.Where(club => club.Id == clubId).First(); //Grab club
            if (club == null)
            {
                throw new HubException("Club Not Found");

            }
            var meeting = await _context.Meeting.Where(meeting => meeting.Club.Id == club.Id && meeting.Id == meetingId).FirstOrDefaultAsync();
            if (meeting == null)
            {
                throw new HubException("Meeting not found.");
            }

            // Create the new chat message
            var chatMessage = new MeetingChat
            {
                Message = msg,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                User = user,
                Meeting = meeting
            };

            // Add the message to the database
            _context.MeetingChat.Add(chatMessage);
            await _context.SaveChangesAsync();
            // Map the created message to the DTO
            var chatMessageDTO = new MeetingChatDTO
            {
                Id = chatMessage.Id,
                Message = chatMessage.Message,
                CreatedAt = chatMessage.CreatedAt,
                UpdatedAt = chatMessage.UpdatedAt,
                User = new UserDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Admin = false,
                }
            };

            await Clients.Group(meetingId.ToString()).SendAsync("chat", chatMessageDTO);
            return chatMessageDTO;
        }

        public async Task RemoveChat(int clubId, int meetingId, int messageId)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            var user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new HubException("User not found.");
            }

            // Fetch the meeting from the database

            if (user == null)
            {
                throw new HubException("User Not Found");
            }
            var club = user.Clubs.Where(club => club.Id == clubId).First(); //Grab club
            if (club == null)
            {
                throw new HubException("Club Not Found");

            }
            var meeting = await _context.Meeting.Where(meeting => meeting.Club.Id == club.Id && meeting.Id == meetingId).FirstOrDefaultAsync();
            if (meeting == null)
            {
                throw new HubException("Meeting not found.");
            }

            // Create the new chat message
            var message = await _context.MeetingChat.Where(message => message.Id == messageId && message.Meeting.Id == meeting.Id).FirstOrDefaultAsync();
            if (message == null)
            {
                throw new HubException("Message not found.");
            }
            // Add the message to the database
            _context.MeetingChat.Remove(message);
            await _context.SaveChangesAsync();

            await Clients.Group(meetingId.ToString()).SendAsync("chatRemove", messageId);
        }
        public async Task LiveRefetch(int clubId, int meetingId)
        {
            var userId = (Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value) ?? throw new HubException("User is not authenticated.");

            var user = await _context.Users.Include(u => u.Clubs).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new HubException("User not found.");
            }

            // Fetch the meeting from the database

            if (user == null)
            {
                throw new HubException("User Not Found");
            }
            var club = user.Clubs.Where(club => club.Id == clubId).First(); //Grab club
            if (club == null)
            {
                throw new HubException("Club Not Found");

            }
            var meeting = await _context.Meeting.Where(meeting => meeting.Club.Id == club.Id && meeting.Id == meetingId).FirstOrDefaultAsync();
            if (meeting == null)
            {
                throw new HubException("Meeting not found.");
            }

            await Clients.Group(meetingId.ToString()).SendAsync("liveRefetch");
        }
    }
}
