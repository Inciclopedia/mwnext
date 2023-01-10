import {useEffect, useState} from "react";
import {loadStyle} from "@/apis/loader";

const useStyle = (skin: string, cached = true): {source: string, error: string} => {
    const maybeSkinSource = window.sessionStorage.getItem("skin_" + skin);

    const [ source, setSource ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (maybeSkinSource && cached) {
            setSource(maybeSkinSource);
            return;
        }
        loadStyle(skin).then((result) => {
            setSource(result);
            window.sessionStorage.setItem("skin_" + skin, result);
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, [skin, maybeSkinSource, cached]);
    return { source, error };
}

export default useStyle;