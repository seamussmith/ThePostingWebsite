
using System.ComponentModel.DataAnnotations.Schema;

namespace ThePostingWebsite.Models;

public record class Comment
{
    public long Id { get; init; }
    public string Author { get; init; } = default!;
    public string Content { get; init; } = default!;
}
