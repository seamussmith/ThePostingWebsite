import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Home() {
    const [articles, setArticles] = useState<any[] | null>([]);
    useEffect(() => {
        fetch("/api/article/")
            .then((blob) => blob.json())
            .then((articles) => setArticles(articles));
    }, []);
    return <div>{articles?.map((article) => <div><Link to={`/article/${article.id}`}>{article.title}</Link></div>) ?? "loading..."}</div>;
}
