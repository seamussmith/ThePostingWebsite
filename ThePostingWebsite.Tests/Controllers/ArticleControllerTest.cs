
using Xunit;
using Moq;
using ThePostingWebsite.Data;
using ThePostingWebsite.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using ThePostingWebsite.Models;
using Xunit.Abstractions;

namespace ThePostingWebsite.Tests.Controllers;

public class ArticleControllerTest
{
    private readonly ITestOutputHelper output;
    public ArticleControllerTest(ITestOutputHelper _output)
    {
        output = _output;
    }
    private DbContextOptions<ArticleContext> makeMockDB(int count = 10)
    {
        var options = new DbContextOptionsBuilder<ArticleContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using (var init = new ArticleContext(options))
        {
            Enumerable.Range(1, count).ToList().ForEach(
                x => init.Add(new Article()
                {
                    Author = "mock",
                    Content = "mock",
                    Title = "mock",
                    Tags = "mock",
                })
            );
            init.SaveChanges();
            var i = 0;
            foreach (var x in init.Articles.Include(x => x.Comments))
            {
                ++i;
                Enumerable.Range(1, count).ToList().ForEach(
                    y => x.Comments.Add(new Comment()
                    {
                        Author= "mock",
                        Content = "mock"
                    })
                );
            }
            output.WriteLine(count.ToString());
            init.SaveChanges();
        }
        return options;
    }
    private ArticleController makeArticleController(ArticleContext opt)
    {
        return new ArticleController(opt, Mock.Of<ILogger<ArticleController>>());
    }
    [Fact]
    public void ArticleController_GetArticles_ReturnsAnIndexOfArticles()
    {
        var articleCount = 10;
        var options = makeMockDB(articleCount);

        using (var context = new ArticleContext(options))
        {
            var articleController = makeArticleController(context);
            var res = articleController.GetArticles();
            // Value should not be null
            Assert.NotNull(res.Value);
            Assert.True(res.Value!.Count == articleCount);
        }
    }
    [Fact]
    public void ArticleController_GetArticle_ShouldReturnTheArticleWithId()
    {
        var options = makeMockDB(1);

        using (var context = new ArticleContext(options))
        {
            var articleController = makeArticleController(context);
            var res = articleController.GetArticle(1);
            Assert.NotNull(res.Value);
        }
    }
    [Fact]
    public void ArticleController_GetArticleComments_ShouldReturnComments()
    {
        var articleCount = 10;
        var options = makeMockDB(articleCount);
        using (var context = new ArticleContext(options))
        {
            var articleController = makeArticleController(context);
            var res = articleController.GetArticleComments(1);
            Assert.NotNull(res.Value);
            Assert.Equal(articleCount, res.Value!.Count);
        }
    }
}
