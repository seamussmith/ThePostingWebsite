import { useEffect, useState } from "react";
import { Redirect, useLocation, useParams } from "react-router";
import { Article } from "../models/Article";

export function ArticlePage(props: {}) {
    const [article, setArticle] = useState<Article | null>(null);
    const [error, setError] = useState(false);
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        fetch(`/api/article/${id}`)
            .then((blob) => blob.json())
            .then((article: Article) => setArticle(article))
            .catch((x) => setError(true));
    }, [id]);
    return (
        <div>
            {article === null ? (
                "Loading article idiot"
            ) : (
                <>
                    <h1>{article.title}</h1>
                    <h5 className="text-muted text-subtitle">By {article.author}</h5>
                    <p>{article.content}</p>
                </>
            )}
            {!error || <Redirect to="/notfound" />}
        </div>
    );
}
