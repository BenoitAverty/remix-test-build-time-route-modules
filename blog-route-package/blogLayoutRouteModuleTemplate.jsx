import {Outlet} from "remix";

const OPTIONS = buildTimeOptions;

export default function Component() {
    return (
        <>
            <h1>{OPTIONS.blogTitle}</h1>
            <Outlet/>
        </>
    )
}
