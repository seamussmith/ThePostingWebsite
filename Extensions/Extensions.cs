
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace ThePostingWebsite.Extensions;

public static class Extensions
{
    public static void LoadEntity<TEntity, TProperty>(this DbContext self, TEntity entity, Expression<Func<TEntity, IEnumerable<TProperty>>> expression)
        where TEntity : class
        where TProperty : class
    {
        self.Entry(entity).Collection(expression).Load();
    }
}