import {useEffect, useState} from "react";
import getNamespaces, {NamespacesResponse} from "@/apis/siteinfo";

const useNamespaces = (cached = true): {namespaces: NamespacesResponse, error: string} => {
    const maybenamespaces = JSON.parse(window.sessionStorage.getItem("namespaces"));

    const [ namespaces, setNamespaces ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (maybenamespaces && cached) {
            setNamespaces(maybenamespaces);
            return;
        }
        getNamespaces().then((result) => {
            setNamespaces(result);
            window.sessionStorage.setItem("namespaces", JSON.stringify(result.data));
        }).catch((error) => {
            setError({code: "clientexception", info: error.message});
        })
    }, [cached]);
    return { namespaces, error };
}

export default useNamespaces;