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
    public ActionResult<Article> GetArticle(long id)
    {
        return (ActionResult<Article>) Ok(articleContext.Articles.Where(x => x.Id == id).FirstOrDefault()!) ?? NotFound();
    }
    [HttpGet("random")]
    public ActionResult GetRandomArticle()
    {
        var article = articleContext.Articles
                .OrderByDescending(x => x.Id)
                .Take(10)
                .AsEnumerable()
                .ElementAt(Random.Shared.Next(0, Math.Min(articleContext.Articles.Count(), 10)));
        return Redirect($"/article/{article.Id}");
    }
    [HttpGet("{id}/comment/")]
    public ActionResult<List<Comment>> GetArticleComments(long id, [FromQuery] int Skip = 0, [FromQuery] int Take = 100)
    {
        return ((ActionResult<List<Comment>>)
            Ok(articleContext.Articles
            .Where(x => x.Id == id)
            .Include(x => x.Comments)
            .FirstOrDefault() // Get the article (null if not found)
            ?.Comments
            .OrderByDescending(x => x.Id) // Get it's comments
            .Skip(Skip)
            .Take(Take)
            .ToList()!)
        ) ?? NotFound();
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
        return Created($"{Request?.Path.Value}{article.Entity.Id}", article.Entity);
    }
    [HttpPost("{id}/comment/")]
    public ActionResult<Comment> PostCommentOnArticle(long id, [FromForm] string Author, [FromForm] string Content)
    {
        var article = articleContext.Articles
            .Where(x => x.Id == id)
            .Include(x => x.Comments)
            .FirstOrDefault();
        if (article is null)
            return NotFound();
        var comment = new Comment()
        {
            Author = Author,
            Content = Content
        };
        article.Comments.Add(comment);
        articleContext.SaveChanges();
        return comment;
    }
    [HttpPut("{id}")]
    public ActionResult<Article> PutArticle(long id, [FromForm] string Content)
    {
        var article = articleContext.Articles.Where(x => x.Id == id).FirstOrDefault();
        if (article is null)
            return NotFound();
        var newArticle = article with
        {
            Content = Content
        };
        articleContext.Remove(article);
        articleContext.Add(newArticle);
        articleContext.SaveChanges();
        return newArticle;
    }
    [HttpDelete("{id}")]
    public ActionResult DeleteArticle(long id)
    {
        var article = articleContext.Articles.Where(x => x.Id == id).FirstOrDefault();
        if (article is null)
            return NotFound();
        articleContext.Articles.Remove(article);
        articleContext.SaveChanges();
        return Ok();
    }
}
