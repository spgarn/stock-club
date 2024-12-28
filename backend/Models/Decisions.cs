using System;
using System.Collections.Generic;

namespace club.Models;

public partial class Decisions
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Markdown { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public virtual Club Club { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
