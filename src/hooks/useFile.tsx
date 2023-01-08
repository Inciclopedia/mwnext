import {useEffect, useState} from "react";
import getFileUrl from "@/apis/imageinfo";

const useFile = (filename: string) => {
    const [ file, setFile ] = useState(null);
    const [ error, setError ] = useState(null);
    useEffect(() => {
        getFileUrl(filename).then((result) => {
            setFile(result);
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, []);
    return { file, error };
}

export default useFile;