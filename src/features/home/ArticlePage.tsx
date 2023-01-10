import React, {useEffect, useState} from 'react';
import ArticleView from "@/features/home/ArticleView";

const ArticlePage: React.FC = () => {
    const [pagename, setPagename] = useState(null);
    useEffect(() => {
        setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
        window.addEventListener('message', ( ev: MessageEvent) => {
            if (ev.data === "url") {
                setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
            }
        });
    }, []);
    return pagename && <div style={{background: "#ffffff"}}><ArticleView page={pagename} /></div>;
};

export default ArticlePage;
