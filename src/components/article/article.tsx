import {ParserArguments} from "@/apis/parser";
import useParser from "@/hooks/useParser";
import React, {useEffect, useState} from "react";
import {Alert, ScopedCssBaseline, Skeleton} from "@mui/material";
import usePageSource from "@/hooks/usePageSource";
import "../../assets/skin.css";
import ErrorIcon from '@mui/icons-material/Error';
import ErrorView from "@/components/errorview/errorview";
import {useTranslation} from "react-i18next";
import getRevisions, {RvProp} from "@/apis/revisions";

interface ArticleProps {
    mwnextHideTitle?: boolean;
}

export default function Article(args: ParserArguments & ArticleProps) {
    const {mwnextHideTitle, ...parserArgs} = args;
    const { parsed: page, error } = useParser(parserArgs);
    const { source: commonCss } = usePageSource("MediaWiki:Common.css");
    const { source: monobookCss } = usePageSource("MediaWiki:Monobook.css");
    const { t } = useTranslation();
    const [ user, setUser] = useState(null);
    const [ timestamp, setTimestamp] = useState(null);
    const [ comment, setComment] = useState(null);
    const [ title, setTitle ] = useState(null);
    useEffect(() => {
        if (parserArgs.oldid) {
            getRevisions({
                revids: parserArgs.oldid.toString(10),
                rvprop: [RvProp.ids, RvProp.user, RvProp.timestamp, RvProp.comment]
            }).then((revisionInfo) => {
                try {
                    setUser((Object.values(revisionInfo.data.query.pages)[0]).revisions[0].user);
                    setTimestamp((Object.values(revisionInfo.data.query.pages)[0]).revisions[0].timestamp);
                    setComment((Object.values(revisionInfo.data.query.pages)[0]).revisions[0].comment);
                    setTitle((Object.values(revisionInfo.data.query.pages)[0]).title);
                } catch (e) {
                    setUser("");
                }
            })
        }
    }, [parserArgs.oldid])
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
        {!page && !error && <Skeleton variant="rectangular" sx={{width: "100%", height: "100%"}} />}
        {!!parserArgs.oldid && <Alert severity="warning">
            <strong>{t("ui.thisIsOld")}&nbsp;( <a href={"/wiki/" + title}>{t("ui.viewLive")}</a> )</strong><br/>
            <strong>{t("ui.revisionBy", { user, timestamp, comment: comment && "(" + comment + ")"})}</strong>
        </Alert>}
        {<div dangerouslySetInnerHTML={{__html: page && page.text}}/>}
        {error !== null && <ErrorView errorMessage={JSON.stringify(error)} icon={<ErrorIcon color="error" />}/>}

        </ScopedCssBaseline>
}