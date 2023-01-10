import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";
import React, {Suspense} from "react";
import {SpecialPages} from "@/features/specialPages/SpecialPages";

const ArticleDispatcher = (props: { page: string }) => {
    const { page } = props;

    if (Object.keys(SpecialPages).includes(page)) {
        const SpecialPage = SpecialPages[page];
        return <Suspense fallback={<div>Loading...</div>}><SpecialPage/></Suspense>;
    } else {
        return <Article page={page} redirects={true}
                        prop={[WikiProp.text, WikiProp.headhtml, WikiProp.displaytitle]} useskin="vector"/>
    }
}

export default ArticleDispatcher;