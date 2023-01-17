import React from "react";

// All declarations for special pages go here. Make sure to lazy load them...
export const SpecialPages: Record<string, React.ExoticComponent> = {
    "Special:RandomRootPage": React.lazy(() => import("../specialPages/RandomRootPage")),
    "Special:UserLogin": React.lazy(() => import("../specialPages/UserLogin")),
    "Special:UserLogout": React.lazy(() => import("../specialPages/UserLogout")),
    "Special:ResetPassword": React.lazy(() => import("../specialPages/ResetPassword"))
}