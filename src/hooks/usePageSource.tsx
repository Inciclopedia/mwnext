import {useEffect, useState} from "react";
import {getWikitext} from "@/apis/parser";

const usePageSource = (page: string, cached = true): {source: string, error: string} => {
    const maybePageSource = window.sessionStorage.getItem("source_" + page);

    const [ source, setSource ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (maybePageSource && cached) {
            setSource(maybePageSource);
            return;
        }
        getWikitext(page).then((result) => {
            setSource(result);
            window.sessionStorage.setItem("source_" + page, result);
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, []);
    return { source, error };
}

export default usePageSource;