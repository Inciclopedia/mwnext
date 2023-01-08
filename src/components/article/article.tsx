import {ParserArguments, WikiProp} from "@/apis/parser";
import useParser from "@/hooks/useParser";
import React from "react";
import {Container, ScopedCssBaseline, useMediaQuery, useTheme} from "@mui/material";

export default function Article(parserArgs: ParserArguments) {
    const {mwnextHideTitle} = parserArgs;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    let args = isMobile ? {...parserArgs, mobileformat: true} : parserArgs;
    const { parsed: page, error } = useParser(parserArgs);
    const { parsed: commonCss } = useParser({
        page: 'MediaWiki:Common.css',
        prop: [WikiProp.wikitext]
    });
    const { parsed: monobookCss } = useParser({
        page: 'MediaWiki:Monobook.css',
        prop: [WikiProp.wikitext]
    });
    if (mwnextHideTitle) {
        document.title = process.env.REACT_APP_NAME;
        window.postMessage("title ");
    } else if (page && page.displaytitle) {
    document.title = page.displaytitle + " - " + process.env.REACT_APP_NAME;
    window.postMessage("title " + page.displaytitle);
    }
    return <ScopedCssBaseline><style>
        {commonCss && commonCss.wikitext["*"]}
        </style>
        <style>
            {monobookCss && monobookCss.wikitext["*"]}
        </style>
        <Container sx={{
            maxWidth: "100%",
            overflow: "auto"
        }}>
        {page !== null && <div dangerouslySetInnerHTML={{__html: page.text["*"]}}/>}
        {error !== null && <div>{error.info}</div>}
    </Container></ScopedCssBaseline>
}