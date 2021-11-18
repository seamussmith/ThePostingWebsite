using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    [HttpGet("{id}")]
    public ActionResult<Article> GetArticle(int id)
    {
        return articleContext.Articles.Where(x => x.Id == id).First();
    }
    [HttpGet("{id}/comments/")]
    public ActionResult<List<Comment>> GetArticleComments(int id, [FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        var article = articleContext.Articles.Where(x => x.Id == id).FirstOrDefault();
        if (article is null)
            return new NotFoundResult();
        articleContext.Entry(article).Collection(p => p.Comments).Load();
        return article.Comments.OrderBy(x => x.Id).Skip(Skip).Take(Take).ToList();
    }
    [HttpGet]
    public IEnumerable<ArticleIndex> GetArticles([FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return articleContext.Articles.OrderByDescending(x => x.Id)
            .Skip(Skip)
            .Take(Take)
            .Select(x => new ArticleIndex(x.Id, x.Title, x.Author));
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
    [HttpDelete("{id}")]
    public ActionResult DeleteArticle(long id)
    {
        var article = articleContext.Articles.Where(x => x.Id == id).FirstOrDefault();
        if (article is null)
            return new NotFoundResult();
        articleContext.Articles.Remove(article);
        articleContext.SaveChanges();
        return new OkResult();
    }
}
