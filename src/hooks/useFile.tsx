import {useEffect, useState} from "react";
import getFileUrl from "@/apis/imageinfo";

const useFile = (filename: string) => {
    const maybeFile = window.sessionStorage.getItem("file_" + filename);

    const [ file, setFile ] = useState(null);
    const [ error, setError ] = useState(null);
    useEffect(() => {
        if (maybeFile) {
            setFile(maybeFile);
            return;
        }
        getFileUrl(filename).then((result) => {
            setFile(result);
            window.sessionStorage.setItem("file_" + filename, result);
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, [filename]);
    return { file, error };
}

export default useFile;