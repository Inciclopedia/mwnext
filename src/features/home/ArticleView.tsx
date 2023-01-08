import React from 'react';
import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";

const ArticleView: React.FC = () => {
    const pagename = window.location.pathname.split("/").slice(2).join('/');
    return <Article page={decodeURIComponent(pagename).replace(/\s/g, "_")} redirects={true} prop={[WikiProp.text]} useskin="vector" />
};

export default ArticleView;
