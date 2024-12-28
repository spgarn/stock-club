using System;
using System.Collections.Generic;

namespace club.Models;

public partial class MeetingChat
{
    public int Id { get; set; }

    //public int UserId { get; set; }

    public string Message { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ApplicationUser User { get; set; } = null!;

    public virtual Meeting Meeting { get; set; } = null!;
}
