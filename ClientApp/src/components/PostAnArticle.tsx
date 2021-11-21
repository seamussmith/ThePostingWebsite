import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { Article } from "../models/Article";
import { AjaxForm } from "./AjaxForm";

export function PostAnArticle({}) {
    // Set to true when submitting the article
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState<Record<any, any> | null>(null);
    const [isServerError, setIsServerError] = useState(false);
    // Form Input values

    const history = useHistory();

    return (
        <div>
            <AjaxForm
                onSubmitStart={() => {
                    setDisabled(true);
                    setError(null);
                    setIsServerError(false);
                    // todo: add wait function
                }}
                onSubmitEnd={() => {
                    setDisabled(false);
                }}
                onClientErrorResponse={async (r) => {
                    setError(await r.json());
                }}
                onServerErrorResponse={async (r) => {
                    setError(await r.json());
                    setIsServerError(true);
                }}
                onSuccessResponse={(r) => r.json().then((a: Article) => history.push(`/article/${a.id}`))}
                action="/api/article/"
                method="POST"
            >
                <FormGroup className="mb-3" autocomplete="off">
                    <FormGroup>
                        <Label htmlFor="Author">Author</Label>
                        <Input name="Author" type="text" autocomplete="off" required disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Title">Title</Label>
                        <Input name="Title" type="text" autocomplete="off" required disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Tags">Tags</Label>
                        <Input name="Tags" type="text" autocomplete="off" disabled={disabled} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="Content">Content</Label>
                        <Input name="Content" type="textarea" autocomplete="off" required disabled={disabled} />
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
            </AjaxForm>
            {error && (
                <div className="mt-2">
                    <h5 className="text-danger">The following errors have occured while processing your request:</h5>
                    <ul>
                        {!isServerError &&
                            Object.values<string[]>(error.errors)
                                .flat()
                                .map((x) => <li className="text-danger">{x}</li>)}
                        {isServerError && <li className="text-danger">Internal Server Error</li>}
                    </ul>
                    <p className="text-danger">
                        Either reload the page or try again later.
                        <br /> If the problem persists, you can notify the developers at{" "}
                        <a href="mailto:nonexistantemail@doesntexist.net">nonexistantemail@doesntexist.net</a>
                    </p>
                </div>
            )}
        </div>
    );
}
