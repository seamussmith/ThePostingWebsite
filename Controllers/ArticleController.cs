using Microsoft.AspNetCore.Mvc;
using ThePostingWebsite.Data;
using ThePostingWebsite.Models;

namespace ThePostingWebsite.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ArticleController : ControllerBase
{
    private readonly ArticleContext articleContext;
    private readonly ILogger<ArticleController> logger;
    public ArticleController(ArticleContext articleContext, ILogger<ArticleController> _logger)
    {
        this.articleContext = articleContext;
        this.logger = _logger;
    }
    [HttpPost]
    public ActionResult<Article> PostArticle([FromForm] string Author, [FromForm] string Content, [FromForm] string Title, [FromForm] string? Tags)
    {
        var article = articleContext.Articles.Add(new Article() {
            Content = Content,
            Tags = Tags ?? "",
            Author = Author,
            Title = Title,
        });
        articleContext.SaveChanges();
        return new CreatedResult($"{Request.Path.Value}{article.Entity.Id}", article.Entity);
    }
    [HttpGet("{id}")]
    public ActionResult<Article> GetArticle(int id)
    {
        return articleContext.Articles.Where(x => x.Id == id).First();
    }
    [HttpGet]
    public IEnumerable<Article> GetArticles([FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return articleContext.Articles.OrderByDescending(x => x.Id).Skip(Skip).Take(Take).AsEnumerable();
    }
    [HttpDelete("{id}")]
    public ActionResult DeleteArticle(long id)
    {
        articleContext.Articles.Remove(articleContext.Articles.Where(x => x.Id == id).First());
        articleContext.SaveChanges();
        return new OkResult();
    }
}
