import { useEffect, useState } from "react"
import { Redirect, useLocation, useParams } from "react-router"

export function Article(props: {}) {
    const [article, setArticle] = useState<any>([])
    const [error, setError] = useState(false)
    const location = useLocation()
    const { id } = useParams<{id:string}>()
    useEffect(() => {
        fetch(`/api/article/${id}`)
        .then(blob => blob.json())
        .then(articles => setArticle(articles))
        .catch(x => setError(true))
    },[])
    return (
        <div>
            {article === null ? "Loading article idiot" : (
                <>
                    <h1>{article.title}</h1>
                    <h5 className="text-muted text-subtitle">By {article.author}</h5>
                    <p>{article.content}</p>
                </>
            )}
            {!error || <Redirect to="notfound" />}
        </div>
    )
}