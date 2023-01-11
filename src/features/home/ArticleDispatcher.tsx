import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";
import React, {Suspense} from "react";
import {SpecialPages} from "@/features/specialPages/SpecialPages";
import {SpecialActions} from "@/features/specialActions/SpecialActions";

const ArticleDispatcher = (props: { page: string }) => {
    const { page } = props;
    const params = new URLSearchParams(window.location.search);

    if (Object.keys(SpecialPages).includes(page)) {
        const SpecialPage = SpecialPages[page];
        return <Suspense fallback={<div>Loading...</div>}><SpecialPage/></Suspense>;
    } else if (params.has("action")) {
        const SpecialAction = SpecialActions[params.get("action")]
        return <Suspense fallback={<div>Loading...</div>}><SpecialAction/></Suspense>;
    } else {
        return <Article page={page} redirects={true}
                        prop={[WikiProp.text, WikiProp.headhtml, WikiProp.displaytitle, WikiProp.categories]} useskin="vector"/>
    }
}

export default ArticleDispatcher;