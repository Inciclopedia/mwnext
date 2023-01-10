import React from "react";

// All declarations for special pages go here. Make sure to lazy load them...
export const SpecialPages: Record<string, React.ExoticComponent> = {
    "Special:RandomRootPage": React.lazy(() => import("../specialPages/RandomRootPage"))
}