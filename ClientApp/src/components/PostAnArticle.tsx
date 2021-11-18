import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { Article } from "../models/Article";

export function PostAnArticle({}) {
  // Set to true when submitting the article
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isServerError, setIsServerError] = useState(false);
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
    setError(false);
    setIsServerError(false);

    // Promise.all awaiting both the article posting and the artificial wait time
    // This is done in the case that posting an article takes longer than the artificial wait time.
    const [article] = await Promise.all([
      // Post the article to the article api
      fetch("/api/article/", {
        method: "POST",
        body: new URLSearchParams(`Title=${_e(title)}&Author=${_e(author)}&Tags=${_e(tags)}&Content=${_e(content)}`),
      }).then<Article>(async (blob) => {
        if (blob.ok) {
          return blob.json();
        } else if (blob.status >= 500) {
          setIsServerError(true);
          throw await blob.json();
        } else if (blob.status >= 400) {
          throw await blob.json();
        } else {
          throw new Error("oh god everything is going wrong");
        }
      }),
      // 500 - 2500ms artificial wait time
      await new Promise<void>((resolve) => setTimeout(() => resolve(), Math.random() * 2000 + 500)),
    ]).catch(async (x) => {
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
        <FormGroup className="mb-3" autocomplete="off">
          <FormGroup>
            <Label htmlFor="Author">Author</Label>
            <Input
              onChange={(x) => setAuthor(x.currentTarget.value)}
              name="Author"
              type="text"
              autocomplete="off"
              required
              disabled={disabled}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Title">Title</Label>
            <Input
              onChange={(x) => setTitle(x.currentTarget.value)}
              name="Title"
              type="text"
              autocomplete="off"
              required
              disabled={disabled}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Tags">Tags</Label>
            <Input onChange={(x) => setTags(x.currentTarget.value)} name="Tags" type="text" autocomplete="off" disabled={disabled} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="Content">Content</Label>
            <Input
              onChange={(x) => setContent(x.currentTarget.value)}
              name="Content"
              type="textarea"
              autocomplete="off"
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
