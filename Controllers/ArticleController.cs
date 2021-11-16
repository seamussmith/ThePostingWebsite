using Microsoft.AspNetCore.Mvc;
using ThePostingWebsite.Data;
using ThePostingWebsite.Models;

namespace ThePostingWebsite.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ArticleController : ControllerBase
{
    private readonly ArticleContext articleContext;
    public ArticleController(ArticleContext articleContext)
    {
        this.articleContext = articleContext;
    }
    [HttpPost]
    public void PostArticle([FromForm] string Author, [FromForm] string Content, [FromForm] string Title, [FromForm] string? Tags)
    {
        articleContext.Articles.Add(new Article() {
            Content = Content,
            Tags = Tags ?? "",
            Author = Author,
            Title = Title,
        });
        articleContext.SaveChanges();
    }
    [HttpGet]
    public IEnumerable<Article> GetArticles([FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return articleContext.Articles.Skip(Skip).Take(Take);
    }
}
