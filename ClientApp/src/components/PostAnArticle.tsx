import React, { useState } from "react"
import { useHistory, useLocation } from "react-router";

export function PostAnArticle({})
{
    const [disabled, setDisabled] = useState(false);
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const history = useHistory();
    async function submitArticle(e: React.FormEvent<HTMLFormElement>)
    {
        // TODO: On submit success, redirect to article
        console.log(author, title, tags, content);
        e.preventDefault();
    }
    return (
        <div>
            <form action="/api/article/" onSubmit={submitArticle}>
                <div>
                    <label htmlFor="Author">Author</label>
                    <input onChange={x => setAuthor(x.currentTarget.value)}name="Author" type="text" required disabled={disabled} />
                </div>
                <div>
                    <label htmlFor="Title">Title</label>
                    <input onChange={x => setTitle(x.currentTarget.value)} name="Title" type="text" required disabled={disabled}/>
                </div>
                <div>
                    <label htmlFor="Tags">Tags</label>
                    <input onChange={x => setTags(x.currentTarget.value)} name="Tags" type="text" disabled={disabled}/>
                </div>
                <div>
                    <label htmlFor="Content">Content</label>
                    <input onChange={x => setContent(x.currentTarget.value)}name="Content" type="text" required disabled={disabled} />
                </div>
                <input type="submit" />
            </form>
        </div>
    )
}