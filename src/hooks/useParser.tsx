import {useEffect, useState} from "react";
import parseWikitext, {ParserArguments} from "@/apis/parser";

const useParser = (params: ParserArguments) => {
    const [ parsed, setParsed ] = useState(null);
    const [ error, setError ] = useState(null);
    useEffect(() => {
        setParsed(null);
        setError(null);
        parseWikitext(params).then((result) => {
            if (result.status < 400 && result.data && result.data.parse) {
                setParsed(result.data.parse);
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