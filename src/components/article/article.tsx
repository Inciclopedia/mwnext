import {ParserArguments} from "@/apis/parser";
import useParser from "@/hooks/useParser";
import React, {useEffect} from "react";
import {ScopedCssBaseline, Skeleton} from "@mui/material";
import usePageSource from "@/hooks/usePageSource";
import "../../assets/skin.css";

interface ArticleProps {
    mwnextHideTitle?: boolean;
}

export default function Article(args: ParserArguments & ArticleProps) {
    const {mwnextHideTitle, ...parserArgs} = args;
    const { parsed: page, error } = useParser(parserArgs);
    const { source: commonCss } = usePageSource("MediaWiki:Common.css");
    const { source: monobookCss } = usePageSource("MediaWiki:Monobook.css");
    useEffect(() => {
        if (mwnextHideTitle) {
            document.title = process.env.REACT_APP_NAME;
            window.postMessage("title ", "*");
        } else if (page && page.displaytitle) {
            document.title = page.displaytitle + " - " + process.env.REACT_APP_NAME;
            window.postMessage("title " + page.displaytitle, "*");
        }
    }, [page, mwnextHideTitle]);
    return <ScopedCssBaseline><style>
        {commonCss}{monobookCss}
        </style>
        {!page && <Skeleton variant="rectangular" sx={{width: "100%", height: "100%"}} />}
        {<div dangerouslySetInnerHTML={{__html: page && page.text}}/>}
        {error !== null && <div>{error.info}</div>}</ScopedCssBaseline>
}