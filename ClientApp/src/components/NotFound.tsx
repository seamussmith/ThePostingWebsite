import { Link } from "react-router-dom";

export function NotFound(params: {})
{
    return (
        <div>
            <h1>404! You're lost...</h1>
            <p>The page you were looking for doesn't exist. Please, let me guide you: </p>
            <ul>
                <li>The Home Page: <Link to="/" >Home</Link></li>
            </ul>
        </div>
    )
}