import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Article } from "../models/Article";

export function NotFound(params: {}) {
    return (
        <div>
            <h1>404! You're lost...</h1>
            <p>The page you were looking for doesn't exist. Please, let me guide you: </p>
            <ul>
                <li>
                    Go to the <Link to="/">Home Page</Link>
                </li>
                <li>
                    Why not read a <a href="/api/article/random">random article?</a>
                </li>
            </ul>
        </div>
    );
}
