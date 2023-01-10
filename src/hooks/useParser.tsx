import {useEffect, useState} from "react";
import parseWikitext, {ParserArguments} from "@/apis/parser";

export interface UseParserProps {
    cached?: boolean;
}

const useParser = (params: ParserArguments & UseParserProps) => {
    const {page, cached} = params;
    const maybePageSource = window.sessionStorage.getItem("source_" + page);
    const [ parsed, setParsed ] = useState(null);
    const [ error, setError ] = useState(null);
    useEffect(() => {
        if (maybePageSource && cached) {
            setParsed(JSON.parse(maybePageSource));
            return;
        }
        setParsed(null);
        setError(null);
        parseWikitext(params).then((result) => {
            if (result.status < 400 && result.data && result.data.parse) {
                setParsed(result.data.parse);
                window.sessionStorage.setItem("source_" + page, JSON.stringify(result.data.parse));
            } else if (result.data && result.data.error) {
                setError(result.data.error);
            } else {
                setError({code: "internalservererror", info: "Server returned code " + result.status + " and no wikitext"});
            }
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, [params.page, params.title, params.text]);
    return { parsed, error };
}

export default useParser;