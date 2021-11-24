using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThePostingWebsite.Data;
using ThePostingWebsite.Models;
using ThePostingWebsite.Extensions;

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
        return (ActionResult<Article>)articleContext.Articles.Where(x => x.Id == id).FirstOrDefault()! ?? new NotFoundResult();
    }
    [HttpGet("{id}/comment/")]
    public ActionResult<List<Comment>> GetArticleComments(int id, [FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return (
            (ActionResult<List<Comment>>)articleContext.Articles
            .Where(x => x.Id == id)
            .Include(x => x.Comments)
            .FirstOrDefault() // Get the article (null if not found)
            ?.Comments
            .OrderByDescending(x => x.Id) // Get it's comments
            .Skip(Skip)
            .Take(Take)
            .ToList()!
        ) ?? new NotFoundResult();
    }
    [HttpGet]
    public ActionResult<List<ArticleIndex>> GetArticles([FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return articleContext.Articles.OrderByDescending(x => x.Id)
            .Skip(Skip)
            .Take(Take)
            .Select(x => new ArticleIndex(x.Id, x.Title, x.Author))
            .ToList();
    }
    [HttpPost]
    public ActionResult<Article> PostArticle([FromForm] string Author, [FromForm] string Content, [FromForm] string Title, [FromForm] string? Tags)
    {
        var article = articleContext.Articles.Add(new Article()
        {
            Content = Content,
            Tags = Tags ?? "",
            Author = Author,
            Title = Title,
        });
        articleContext.SaveChanges();
        return new CreatedResult($"{Request.Path.Value}{article.Entity.Id}", article.Entity);
    }
    [HttpPost("{id}/comment/")]
    public ActionResult<Comment> PostCommentOnArticle(int id, [FromForm] string Author, [FromForm] string Content)
    {
        var article = articleContext.Articles
            .Where(x => x.Id == id)
            .Include(x => x.Comments)
            .FirstOrDefault();
        if (article is null)
            return new NotFoundResult();
        var comment = new Comment()
        {
            Author = Author,
            Content = Content
        };
        article.Comments.Add(comment);
        articleContext.SaveChanges();
        return comment;
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
