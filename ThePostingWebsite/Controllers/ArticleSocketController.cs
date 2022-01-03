
using Microsoft.AspNetCore.Mvc;
using ThePostingWebsite.Models;
using ThePostingWebsite.Data;

namespace ThePostingWebsite.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ArticleSocketController : ControllerBase
{
    readonly ArticleContext articleContext;
    readonly ILogger<ArticleSocketController> logger;
    public ArticleSocketController(ArticleContext articleContext, ILogger<ArticleSocketController> logger)
    {
        this.articleContext = articleContext;
        this.logger = logger;
    }
}