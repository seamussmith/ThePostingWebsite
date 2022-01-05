import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArticleIndex } from "../models/ArticleIndex";
import { ArticleCard } from "./ArticleCard";

export function Home() {
    const [articles, setArticles] = useState<ArticleIndex[] | null>([]);
    useEffect(() => {
        fetch("/api/article/")
            .then((blob) => blob.json())
            .then((articles) => setArticles(articles));
    }, []);
    return (
        <div>
            {articles?.map((article) => (
                <div>
                    <ArticleCard article={article} />
                </div>
            )) ?? "loading..."}
        </div>
    );
}
