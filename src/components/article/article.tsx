import {ParserArguments, WikiProp} from "@/apis/parser";
import useParser from "@/hooks/useParser";
import React from "react";
import Paper from "@mui/material/Paper";
import {Container, ScopedCssBaseline} from "@mui/material";

export default function Article(parserArgs: ParserArguments) {
    const { parsed: page, error } = useParser(parserArgs);
    const { parsed: commonCss } = useParser({
        page: 'MediaWiki:Common.css',
        prop: [WikiProp.wikitext]
    });
    const { parsed: monobookCss } = useParser({
        page: 'MediaWiki:Monobook.css',
        prop: [WikiProp.wikitext]
    });
    return <ScopedCssBaseline><style>
        {commonCss && commonCss.wikitext["*"]}
        </style>
        <style>
            {monobookCss && monobookCss.wikitext["*"]}
        </style>
        <Paper variant="outlined"><Container maxWidth="lg">
        {page !== null && <div dangerouslySetInnerHTML={{__html: page.text["*"]}}/>}
        {error !== null && <div>{error.info}</div>}
    </Container></Paper></ScopedCssBaseline>
}