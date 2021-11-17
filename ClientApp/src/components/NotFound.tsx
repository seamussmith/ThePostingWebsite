import { useState } from "react";
import { Link } from "react-router-dom";

export function NotFound(params: {}) {
    const [articles, setArticles] = useState<any>(null);
    fetch("/api/article/?take=10")
        .then((blob) => blob.json())
        .then((articles) => setArticles(articles));
    return (
        <div>
            <h1>404! You're lost...</h1>
            <p>The page you were looking for doesn't exist. Please, let me guide you: </p>
            <ul>
                <li>
                    Go to the <Link to="/">Home Page</Link>
                </li>
                <li>
                    Why not read a <Link to="/notimplemented">random article?</Link>
                </li>
            </ul>
        </div>
    );
}
