import { useEffect, useState } from "react";
import { Redirect, useLocation, useParams } from "react-router";
import {
    Button,
    ButtonDropdown,
    Card,
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    Input,
    Label,
} from "reactstrap";
import { Article } from "../models/Article";
import { Comment } from "../models/Comment";

export function ArticlePage(props: {}) {
    const [article, setArticle] = useState<Article | null>(null);
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [error, setError] = useState(false);
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        fetch(`/api/article/${id}`)
            .then<Article>((blob) => {
                if (blob.ok) {
                    return blob.json();
                } else {
                    throw blob;
                }
            })
            .then((article) => setArticle(article))
            .catch((x) => setError(true));
        fetch(`/api/article/${id}/comment/`)
            .then<Comment[]>((blob) => {
                if (blob.ok) {
                    return blob.json();
                } else {
                    throw blob;
                }
            })
            .then((comments) => setComments(comments))
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
            <hr />
            <CommentForm id={id} />
            <hr />
            <h2>Comments:</h2>
            {comments?.map((c) => (
                <div>
                    <h4>{c.author} says:</h4>
                    <div className="ms-3">
                        <p>{c.content}</p>
                    </div>
                    <div className="d-flex">
                        <Button className="mx-1" size="sm" color="primary" disabled>
                            Delete Comment
                        </Button>
                        <Button className="mx-1" size="sm" color="danger">
                            Mald
                        </Button>
                        <Button className="mx-1" size="sm" color="warning">
                            Cope
                        </Button>
                        <Button className="mx-1" size="sm" color="success">
                            Uninstall (the app not this guy)
                        </Button>
                    </div>
                </div>
            ))}
            {comments !== null && comments?.length === 0 && (
                <h5 className="text-muted">It looks like nobody is talking about this article. Why don't you join the conversation?</h5>
            )}
            {!error || <Redirect to="/notfound" />}
        </div>
    );
}

function CommentForm({ onSuccess, id }: { onSuccess?: (comment: Comment) => void; id: string }) {
    const [commentDropdownOpened, setCommentDropdownOpened] = useState(false);
    return (
        <>
            <Button color="primary" onClick={() => setCommentDropdownOpened(!commentDropdownOpened)}>
                Write a comment!
            </Button>
            <Collapse className="mt-2" isOpen={commentDropdownOpened}>
                <Form action={`/api/article/${id}/comment/`} method="POST">
                    <Label htmlFor="Author">Name:</Label>
                    <Input name="Author" type="text" required />
                    <Label htmlFor="Content"></Label>
                    <Input name="Content" required type="textarea" placeholder="What do you want to say?" />
                    <Input type="submit" color="secondary" />
                </Form>
            </Collapse>
        </>
    );
}
