import React, {useEffect, useState} from 'react';
import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";

const ArticleView: React.FC = () => {
    const [pagename, setPagename] = useState(null);
    useEffect(() => {
        setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
        window.addEventListener('message', ( ev: MessageEvent) => {
            if (ev.data === "url") {
                setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
            }
        });
    }, []);
    return pagename && <Article page={pagename} redirects={true} prop={[WikiProp.text, WikiProp.displaytitle]} useskin="vector" />;
};

export default ArticleView;
