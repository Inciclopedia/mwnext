import {redirectURL} from "@/helpers/router";
import React from "react";

export default function ResetPassword() {
    redirectURL("/forgotpassword");
    return <></>;
}