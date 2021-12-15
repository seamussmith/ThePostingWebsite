import { useLocation, useParams } from "react-router-dom";
import { AjaxForm } from "./AjaxForm";

export function EditArticle({}) {
    let params = useParams<{ id: string }>();
    return (
        <div>
            <AjaxForm method="PUT" action={`api/article/${params.id}`}>
                <input type="textarea" />
            </AjaxForm>
        </div>
    );
}
