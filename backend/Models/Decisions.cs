﻿using System;
using System.Collections.Generic;

namespace club.Models;

//Please note that this is actually NEWS, not Decisions. It has been left unchanged to not cause migration issues.
public partial class Decisions //News
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Markdown { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public virtual Club Club { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
