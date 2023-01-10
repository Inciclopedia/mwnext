import React, {ReactElement} from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";

export interface ErrorViewProps {
    errorMessage: string;
    icon?: ReactElement;
}

export default function ErrorView(props: ErrorViewProps) {
    const {errorMessage, icon} = props;
    const {t} = useTranslation();
    return <Paper>
        {icon}
        <Typography>
            {t("ui.oops")}
        </Typography>
        <Typography>
            {errorMessage}
        </Typography>
    </Paper>
}