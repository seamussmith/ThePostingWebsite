import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Article } from "../models/Article";
import { AjaxForm } from "./AjaxForm";
import MDEditor from "@uiw/react-md-editor";

export function EditArticle({}) {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [contentFieldText, setContentFieldText] = useState("");
    useEffect(() => {
        fetch(`api/article/${params.id}`)
            .then<Article>((x) => x.json())
            .then((x) => {
                setArticle(article);
                setContentFieldText(x.content);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <AjaxForm method="PUT" action={`api/article/${params.id}`} onSuccessResponse={() => history.push(`/article/${params.id}`)}>
                <FormGroup>
                    <Label htmlFor="Content">Content</Label>
                    {!loading && (
                        <MDEditor value={contentFieldText} onChange={(x) => setContentFieldText(x ?? "")} height={25 * 25}></MDEditor>
                    )}
                    <input type="hidden" name="Content" value={contentFieldText} />
                </FormGroup>
                <FormGroup className="mt-1">
                    <Button type="submit">Submit Changes</Button>
                </FormGroup>
            </AjaxForm>
        </div>
    );
}
