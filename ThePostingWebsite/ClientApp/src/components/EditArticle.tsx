import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Article } from "../models/Article";
import { AjaxForm } from "./AjaxForm";

export function EditArticle({}) {
    const params = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [contentFieldText, setContentFieldText] = useState("");
    useEffect(() => {
        fetch(`api/article/${params.id}`)
            .then<Article>((x) => x.json())
            .then((x) => {
                setArticle(article);
                setContentFieldText(x.content);
            });
    }, []);
    return (
        <div>
            <AjaxForm method="PUT" action={`api/article/${params.id}`}>
                <FormGroup>
                    <Label htmlFor="Content">Content</Label>
                    <Input
                        name="Content"
                        type="textarea"
                        required
                        value={contentFieldText}
                        onChange={(e) => setContentFieldText(e.target.value)}
                    />
                </FormGroup>
                <FormGroup className="mt-1">
                    <Button type="submit">Edit</Button>
                </FormGroup>
            </AjaxForm>
        </div>
    );
}