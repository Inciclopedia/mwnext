import React, {useEffect} from "react";

export interface RandomRootPageProps {
    myProp?: string;
}

export default function RandomRootPage(props: RandomRootPageProps) {
    useEffect(() => {
        console.log("just some random code to avoid tslint complaining, you can delete this block")
    }, []);
    return <p>implement me :)</p>
}