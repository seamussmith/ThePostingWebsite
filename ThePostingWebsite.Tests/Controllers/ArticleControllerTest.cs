
using Xunit;
using Moq;
using System.Threading.Tasks;
using ThePostingWebsite.Data;
using ThePostingWebsite.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ThePostingWebsite.Models;
using System.Linq;

namespace ThePostingWebsite.Tests.Controllers;

public class ArticleControllerTest
{
    public ArticleControllerTest()
    {
    }
    [Fact]
    public void ApiArticle_ReturnsAnIndexOfArticles()
    {
        var articleCount = 10;
        var options = new DbContextOptionsBuilder<ArticleContext>()
            .UseInMemoryDatabase(databaseName: "MovieListDatabase")
            .Options;
        using (var init = new ArticleContext(options))
        {
            Enumerable.Range(1, articleCount).ToList().ForEach(
                x => init.Add(new Article()
                {
                    Author = "mock",
                    Content = "mock",
                    Title = "mock",
                    Tags = "mock",
                })
            );
            init.SaveChanges();
        }

        using (var context = new ArticleContext(options))
        {
            var logger = Mock.Of<ILogger<ArticleController>>();
            var articleController = new ArticleController(context, logger);
            var res = articleController.GetArticles();
            // Value should not be null
            Assert.True(res.Value!.Count == articleCount);
        }
    }
}
