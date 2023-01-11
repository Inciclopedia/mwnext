import React from "react";
import Paper from "@mui/material/Paper";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import {goURL} from "@/helpers/router";
import purge from "@/apis/purge";

export default function Purge () {
    const page = decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_");
    const {t} = useTranslation();
    document.title = page + " - " + process.env.REACT_APP_NAME;
    window.postMessage("title " + page, "*");

    function doPurge() {
        purge(page).then(() => {
            goURL("/wiki/" + page);
        })
    }

    return <Paper sx={{padding: "20px"}}>
        <b>{t("ui.purgeTitle")}</b>
        <p>{t("ui.purgeSubtitle")}</p>
        <Button onClick={doPurge} variant="contained" sx={{marginRight: "10px"}}>{t("ui.ok")}</Button>
        <Button onClick={() => goURL("/wiki/" + page)}>{t("ui.cancel")}</Button>
    </Paper>;
}