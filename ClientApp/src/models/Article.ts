import { Comment } from "./Comment";

export interface Article {
    id: number;
    comments: Comment[];
    title: string;
    author: string;
    content: string;
    tags: string;
}
