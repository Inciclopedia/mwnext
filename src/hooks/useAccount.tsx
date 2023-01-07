import {useEffect, useState} from "react";

const useAccount = () => {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        if (!window.localStorage.getItem("authenticated")) {
            window.onmessage = (( ev: MessageEvent) => {
                if (ev.data === "authenticated") {
                    setAccount(JSON.parse(window.localStorage.getItem("currentUser")));
                }
            });
        } else {
            setAccount(JSON.parse(window.localStorage.getItem("currentUser")));
        }
    }, []);

    return {account};
}

export default useAccount;