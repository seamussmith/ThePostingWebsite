
export function PostAnArticle({})
{
    return (
        <div>
            <form action="/api/article/" method="POST">
                <label htmlFor="Author">Author</label>
                <input name="Author" type="text" required />
                <label htmlFor="Title">Title</label>
                <input name="Title" type="text" required />
                <label htmlFor="Tags">Tags</label>
                <input name="Tags" type="text" />
                <label htmlFor="Content">Content</label>
                <input name="Content" type="text" required />
                <input type="submit" />
            </form>
        </div>
    )
}