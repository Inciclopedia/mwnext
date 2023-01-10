import React, {useEffect, useState} from 'react';
import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";
import {Fab, Tab, Tabs, useMediaQuery, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import {Namespace} from "@/apis/siteinfo";
import useNamespaces from "@/hooks/useNamespaces";
import {goURL} from "@/helpers/router";

export interface ArticleViewProps {
    page?: string;
    mwnextHideTitle?: boolean;
}

const ArticleView : React.FC<ArticleViewProps> = (props: ArticleViewProps) => {
    const { page } = props;
    const theme = useTheme();
    const [pagename, setPagename] = useState(page);
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { namespaces } = useNamespaces();
    let talkPage = "";
    if (namespaces && namespaces.query && namespaces.query.namespaces) {
        const curNamespace = pagename.indexOf(":") != -1 ? pagename.split(":")[0] : "";
        const foundNamespace = Object.values(namespaces.query.namespaces).filter((ns: Namespace) => ns["*"] === curNamespace)[0]
        if (foundNamespace) {
            const curNamespaceId = foundNamespace.id;
            const talkNsId = curNamespaceId + 1;
            talkPage = pagename.replace(curNamespace, namespaces.query.namespaces[talkNsId]["*"]);
        }
    }

    useEffect(() => {
        if (!pagename) {
            setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
        }
        window.addEventListener('message', ( ev: MessageEvent) => {
            if (ev.data === "url") {
                setPagename(decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_"));
            }
        });
    }, [pagename]);
    
    return pagename && <><div style={{
        overflowX: "auto",
        overflowY: "auto",
        width: isMobile ? "calc(100% - 20px)" : "calc(100% - 270px)",
        height: "calc(100% - 92px)",
        position: "absolute",
        left: isMobile ? 0 : "250px",
        margin: "10px",
        padding: "10px"
    }}><Fab color="primary" aria-label="edit" sx={{position: "fixed", top: "100%", left: "100%", marginLeft: "-96px", marginTop: "-96px"}}>
        <EditIcon />
    </Fab><Tabs value={0} onChange={(ev, tabClicked) => {
        if (tabClicked == 1) {
            goURL("/wiki/" + talkPage);
        }
    }
    }>
        <Tab label="Página"></Tab>
        <Tab label="Discusión"></Tab>
        <Box sx={{flexGrow: 1}}/>
        <Button>Editar</Button>
        <Button>Historial</Button>
        <IconButton>
            <StarBorderIcon />
        </IconButton>
        <IconButton>
            <MoreVertIcon />
        </IconButton>
    </Tabs><Article page={pagename} redirects={true} prop={[WikiProp.text, WikiProp.headhtml, WikiProp.displaytitle]} useskin="vector" /></div></>;
};

export default ArticleView;
