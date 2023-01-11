import {redirectURL} from "@/helpers/router";
import React from "react";

export default function UserLogout() {
    redirectURL("/logout");
    return <></>;
}