import React from "react";

// All declarations for special pages go here. Make sure to lazy load them...
export const SpecialActions: Record<string, React.ExoticComponent> = {
    "purge": React.lazy(() => import("../specialActions/purge"))
}