import {useLoaderData} from "remix"

const OPTIONS = buildTimeOptions;

export function meta({params: {slug}}) {
    if (!slug) throw new Error("slug missing")

    return {title: `${OPTIONS.blogTitle} - ${slug}`};
}

export async function loader({params: {slug}}) {
    if (!slug) throw new Error("slug missing")

    return await fetch(`https://api.github.com/repos/${OPTIONS.repo}/contents/${OPTIONS.contentFolder}/${slug}.md`, {
        headers: {
            "Accept": "application/vnd.github.v3.html"
        }
    })
}

export default function Article() {
    const content = useLoaderData()

    return <div dangerouslySetInnerHTML={{__html: content}}/>
}