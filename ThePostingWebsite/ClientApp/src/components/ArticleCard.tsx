import { Link } from "react-router-dom";
import { Card, CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap";
import { ArticleIndex } from "../models/ArticleIndex";

export function ArticleCard(props: { article: ArticleIndex }) {
    return (
        <Card className="mb-2">
            <CardBody>
                {/* <CardImg top src="https://media.istockphoto.com/photos/pile-of-paper-documents-in-the-office-picture-id1068380820" /> */}
                <CardTitle tag="h5" className="link-primary">
                    <a>{props.article.title}</a>
                </CardTitle>
                <CardSubtitle>By {props.article.author}</CardSubtitle>
                <Link to={`/article/${props.article.id}`} className="stretched-link"></Link>
            </CardBody>
        </Card>
    );
}
