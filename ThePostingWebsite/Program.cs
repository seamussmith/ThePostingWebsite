using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using ThePostingWebsite.Data;
using Microsoft.AspNetCore.Identity;
using ThePostingWebsite.Areas.Identity.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ArticleContext>((options) =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString(nameof(ArticleContext)));
});
builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ThePostingWebsiteIdentityDbContext>();builder.Services.AddDbContext<ThePostingWebsiteIdentityDbContext>(options =>
    options.UseSqlServer(connectionString));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
// dotnet-aspnet-codegenerator controller -name TestController -m Test -dc TestContext --relativeFolderPath Controllers --useDefaultLayout --referenceScriptLibraries -sqlite
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();app.UseWebSockets();


app.MapControllerRoute(
    name: "default",
    pattern: "/api/{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
