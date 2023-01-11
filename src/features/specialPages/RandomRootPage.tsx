import { randomArticle } from "@/apis/randomArticle";
import { redirectURL } from "@/helpers/router";
import { result } from "lodash";
import React, { useEffect } from "react";

export interface RandomRootPageProps {
    myProp?: string;
}

export default function RandomRootPage(props: RandomRootPageProps) {
    useEffect(() => {
        randomArticle({
            rnlimit: 0,
            rnnamespace: "0",
            rnfilterredir: "nonredirects"
        }).then((result) => {
            const pageName = result.data.query.random[0].title;
            redirectURL("/wiki/" + pageName);
        })
    }, [])

    return <></>;
}