
using System.ComponentModel.DataAnnotations;

namespace ThePostingWebsite.Models;

public record class Article
{
    public long Id { get; init; }
    public List<Comment> Comments { get; init; } = default!;
    public string Title { get; init; } = default!;
    public string Author { get; init; } = default!;
    public string Content { get; init; } = default!;
    public string Tags { get; init; } = default!;
}
