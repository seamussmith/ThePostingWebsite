
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

    
}
