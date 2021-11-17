import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { Article } from "../models/Article";

export function PostAnArticle({}) {
    // Set to true when submitting the article
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<any>(null);
    // Form Input values
    // NOTE: Hot reload may make state out of sync with the document. Take note when debugging.
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");

    const history = useHistory();

    async function submitArticle(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // I hate typing
        const _e = encodeURIComponent;
        setDisabled(true);

        // Promise.all awaiting both the article posting and the artificial wait time
        // This is done in the case that posting an article takes longer than the artificial wait time.
        const [article] = await Promise.all([
            // Post the article to the article api
            fetch("/api/article/", {
                method: "POST",
                body: new URLSearchParams(`Author=${_e(author)}&Tags=${_e(tags)}&Content=${_e(content)}`),
            }).then<Article>(async (blob) => {
                if (blob.ok) {
                    return blob.json();
                } else {
                    throw await blob.json();
                }
            }),
            // 500 - 2500ms artificial wait time
            await new Promise<void>((resolve) => setTimeout(() => resolve(), Math.random() * 2000 + 500)),
        ]).catch(async (x) => {
            console.log(Object.values(x.errors));
            setDisabled(false);
            setError(x);
            throw x;
        });

        // Artificial wait times may seem unethical, but it does enhance the user experience by making the app feel better.

        // Send user to the article they worked so hard on
        history.push(`/article/${article.id}`);
    }
    return (
        <div>
            <Form onSubmit={submitArticle}>
                <FormGroup className="mb-3">
                    <FormGroup>
                        <Label htmlFor="Author">Author</Label>
                        <Input onChange={(x) => setAuthor(x.currentTarget.value)} name="Author" type="text" required disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Title">Title</Label>
                        <Input onChange={(x) => setTitle(x.currentTarget.value)} name="Title" type="text" required disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Tags">Tags</Label>
                        <Input onChange={(x) => setTags(x.currentTarget.value)} name="Tags" type="text" disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Content">Content</Label>
                        <Input
                            onChange={(x) => setContent(x.currentTarget.value)}
                            name="Content"
                            type="textarea"
                            required
                            disabled={disabled}
                        />
                    </FormGroup>
                </FormGroup>
                <FormGroup>
                    <Button className="d-flex align-items-center justify-content-center" color="primary" size="lg" type="submit">
                        {disabled ? (
                            <>
                                <Spinner className="m-1" animation="border" size="sm" children />
                                Submitting Article...
                            </>
                        ) : (
                            <>Submit your article!</>
                        )}
                    </Button>
                </FormGroup>
            </Form>
            <div>
                {error && (
                    <div className="mt-2">
                        <h5 className="text-danger">The following errors have occured while processing your request:</h5>
                        <ul>
                            {Object.values<string[]>(error.errors)
                                .flat()
                                .map((x) => (
                                    <li className="text-danger">{x}</li>
                                ))}
                        </ul>
                        <p className="text-danger">
                            Either reload the page or try again
                            <br /> If the problem persists, either try again or report this as a bug to the developers
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
