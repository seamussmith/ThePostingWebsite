import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router"

export function Article(props: {}) {
    const [article, setArticle] = useState<any>([])
    const { id } = useParams<{id:string}>()
    useEffect(() => {
        fetch(`/api/article/${id}`)
        .then(blob => blob.json())
        .then(articles => setArticle(articles))
    },[])
    return (
        <div>
            {article?.content ?? "loading article lmao good luck bad internet user"}
        </div>
    )
}