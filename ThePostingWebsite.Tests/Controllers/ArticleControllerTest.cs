
using Xunit;
using Moq;
using ThePostingWebsite.Data;
using ThePostingWebsite.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using ThePostingWebsite.Models;
using Xunit.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace ThePostingWebsite.Tests.Controllers;

public class ArticleControllerTest
{
    private readonly ITestOutputHelper output;
    public ArticleControllerTest(ITestOutputHelper _output)
    {
        output = _output;
    }
    private DbContextOptions<ArticleContext> makeMockDB(int postCount = 0, int commentCount = 0)
    {
        var options = new DbContextOptionsBuilder<ArticleContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        using (var init = new ArticleContext(options))
        {
            Enumerable.Range(1, postCount).ToList().ForEach(
                x => init.Add(new Article()
                {
                    Author = "mock",
                    Content = "mock",
                    Title = "mock",
                    Tags = "mock",
                })
            );
            init.SaveChanges();
            foreach (var x in init.Articles.Include(x => x.Comments))
            {
                Enumerable.Range(1, commentCount).ToList().ForEach(
                    y => x.Comments.Add(new Comment()
                    {
                        Author = "mock",
                        Content = "mock"
                    })
                );
            }
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
        var commentCount = 10;
        var options = makeMockDB(postCount: 1, commentCount: commentCount);
        using (var context = new ArticleContext(options))
        {
            var articleController = makeArticleController(context);
            var res = articleController.GetArticleComments(1);
            Assert.NotNull(res.Value);
            Assert.Equal(commentCount, res.Value!.Count);
        }
    }
    [Fact]
    public void Articlecontroller_PostArticle_ShouldPostTheArticle()
    {
        var options = makeMockDB();
        using (var context = new ArticleContext(options))
        {
            var articleController = makeArticleController(context);
            var res = articleController.PostArticle(
                Author: "mock",
                Content: "mock",
                Title: "mock",
                Tags: "mock"
            ).Result as CreatedResult;
            // NULL CHECKER WHY MUST YOU MAKE ME !!!!11!!!1!1!!1!!!!!111!!11!!!11
            Assert.IsType<CreatedResult>(res);
            var createdObject = (res!.Value as Article)!;
            var resget = articleController.GetArticle(createdObject.Id);
            Assert.True(resget.Value == createdObject);
        }
    }
    [Fact]
    public void ArticleController_PostCommentOnArticle_ShouldPostACommentOnAnArticle()
    {
        using (var context = new ArticleContext(makeMockDB(1)))
        {
            var articleController = makeArticleController(context);
            var res = articleController.PostCommentOnArticle(1, "mock", "mock");
            Assert.NotNull(res.Value);
            // Cannot get the comment as of yet. TODO: Test that
        }
    }
    [Fact]
    public void ArticleController_DeleteArticle_ShouldDeleteTheArticle()
    {
        using (var context = new ArticleContext(makeMockDB(1)))
        {
            var articleController = makeArticleController(context);
            var res = articleController.DeleteArticle(1);
            Assert.IsType<OkResult>(res);
            Assert.Empty(context.Articles);
        }
    }
    [Fact]
    public void ArticleController_PutArticle_ShouldEditTheArticle()
    {
        using (var context = new ArticleContext(makeMockDB()))
        {
            context.Add(new Article()
            {
                Author = "mock",
                Content = "mock",
                Title = "mock",
                Tags = "mock"
            });
            context.SaveChanges();
            var con = makeArticleController(context);
            var res = con.PutArticle(1, "content");
            var res2 = con.GetArticle(1);
            Assert.Equal(res.Value!.Content, res2.Value!.Content);
        }
    }
}
