
using Microsoft.EntityFrameworkCore;
using ThePostingWebsite.Models;

namespace ThePostingWebsite.Data;

public class ArticleContext : DbContext
{
    public ArticleContext()
    {
    }
    public ArticleContext(DbContextOptions<ArticleContext> options) : base (options)
    {
    }

    public DbSet<Article> Articles { get; set; } = default!;
    public DbSet<Comment> Comments { get; set; } = default!;
}
