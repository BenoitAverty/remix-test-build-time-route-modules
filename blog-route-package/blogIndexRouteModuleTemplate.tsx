import {json, Link, LoaderFunction, useLoaderData} from "remix";

// @ts-ignore
const OPTIONS = buildTimeOptions;

export async function loader() {
    const resp = await fetch(`https://api.github.com/repos/${OPTIONS.repo}/contents/${OPTIONS.contentFolder}`, {
        headers: {
            "Accept": "application/vnd.github.v3+json"
        }
    })
    const articles = await resp.json()
    return json({
        articles: articles.map((a: { name: string; }) => a.name.split(".")[0])
    })
}

export default function Component() {
    const {articles} = useLoaderData();

    return (
        <>
            <h1>List of articles</h1>

            <ul>
                {articles.map((a: string) => <li key={a}><Link to={a}>{a}</Link></li>)}
            </ul>
        </>
    )
}