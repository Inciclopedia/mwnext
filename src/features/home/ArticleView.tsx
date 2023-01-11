import React from 'react';
import {Divider, Fab, ListItemIcon, ListItemText, Tab, Tabs, useMediaQuery, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TranslateIcon from '@mui/icons-material/Translate';
import LockIcon from '@mui/icons-material/Lock';
import PrintIcon from '@mui/icons-material/Print';
import PhishingIcon from '@mui/icons-material/Phishing';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from "@mui/material/IconButton";
import {Namespace} from "@/apis/siteinfo";
import useNamespaces from "@/hooks/useNamespaces";
import {goURL} from "@/helpers/router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArticleDispatcher from "@/features/home/ArticleDispatcher";
import useParser from "@/hooks/useParser";
import {LangLink, WikiProp} from "@/apis/parser";
import {useTranslation} from "react-i18next";

export interface ArticleViewProps {
    page?: string;
    mwnextHideTitle?: boolean;
}

const ArticleView: React.FC<ArticleViewProps> = (props: ArticleViewProps) => {
    const {page} = props;
    const theme = useTheme();
    const pagename = page || decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(/\s/g, "_");
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {namespaces} = useNamespaces();
    const {parsed: pageinfo} = useParser({ page, prop: [WikiProp.wikitext, WikiProp.langlinks, WikiProp.revid] });
    const langLinks = pageinfo && pageinfo.langlinks;
    const [moreMenuAnchor, setMoreMenuAnchor] = React.useState<null | HTMLElement>(null);
    const moreMenuOpen = Boolean(moreMenuAnchor);
    const {t} = useTranslation();
    const openMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMoreMenuAnchor(event.currentTarget);
    };
    const closeMoreMenu = () => {
        setMoreMenuAnchor(null);
    };
    const [langMenuAnchor, setlangMenuAnchor] = React.useState<null | HTMLElement>(null);
    const langMenuOpen = Boolean(langMenuAnchor);
    const openlangMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setlangMenuAnchor(event.currentTarget);
    };
    const closelangMenu = () => {
        setlangMenuAnchor(null);
    };

    const notImplemented = () => {
        alert("Not implemented :)");
        closeMoreMenu();
    }
    const share = () => {
        if (!navigator.share) {
            return;
        }
        try {
            navigator.share({
                title: document.title,
                text: pageinfo.wikitext,
                url: window.location.href
            });
        } catch (e) {
            alert(t("ui.couldntshare"));
        }

    }
    let mainPage = "";
    let talkPage = "";
    let isTalkPage = false;
    if (namespaces && namespaces.query && namespaces.query.namespaces) {
        const curNamespace = pagename.indexOf(":") != -1 ? pagename.split(":")[0] : "";
        const foundNamespace = Object.values(namespaces.query.namespaces).filter((ns: Namespace) => ns["*"] === curNamespace.replace("_", " "))[0]
        if (foundNamespace) {
            const curNamespaceId = parseInt(foundNamespace.id, 10);
            const prevNamespace = namespaces.query.namespaces[curNamespaceId - 1]["*"];
            const nextNamespace = namespaces.query.namespaces[curNamespaceId + 1]["*"];
            if (curNamespace.startsWith(prevNamespace)) {
                isTalkPage = true;
                talkPage = pagename;
                mainPage = pagename.replace(curNamespace, prevNamespace);
            } else {
                mainPage = pagename;
                talkPage = pagename.replace(curNamespace, nextNamespace);
            }
        }
    }

    return pagename && <div style={{
        position: "absolute",
        overflowX: "hidden",
        overflowY: "hidden",
        width: isMobile ? "calc(100% - 4px)" : "calc(100% - 270px)",
        height: isMobile ? "calc(100% - 72px)" : "calc(100% - 92px)",
        left: isMobile ? 0 : "250px",
        margin: isMobile ? 0 : "10px",
        paddingTop: isMobile ? "0px" : "10px",
        paddingLeft: isMobile ? "10px" : "10px",
        paddingRight: isMobile ? "4px" : "10px",
        paddingBottom: isMobile ? "0px" : "10px"}}>
        {isMobile && <Fab color="primary" aria-label="edit" title="Editar"
                          sx={{position: "fixed", top: "100%", left: "100%", marginLeft: "-96px", marginTop: "-96px"}} onClick={notImplemented}>
            <EditIcon/>
        </Fab>}<Tabs value={isTalkPage ? 1 : 0} onChange={(ev, tabClicked) => {
        if (tabClicked == 1 && !isTalkPage) {
            goURL("/wiki/" + talkPage);
        }
        if (tabClicked == 0 && isTalkPage) {
            goURL("/wiki/" + mainPage);
        }
    }
    }>
        <Tab label="Página"></Tab>
        <Tab label="Discusión"></Tab>
        <Box sx={{flexGrow: 1}}/>
        {!isMobile && <><IconButton title="Editar" onClick={notImplemented}>
            <EditIcon/>
        </IconButton>
            <IconButton title="Historial" onClick={notImplemented}>
                <HistoryIcon/>
            </IconButton>
        {langLinks && langLinks.length > 0 && <IconButton onClick={openlangMenu} title="Otros idiomas">
                <TranslateIcon/>
            </IconButton>}
            <IconButton title="Guardar en mi lista de seguimiento" onClick={notImplemented}>
                <StarBorderIcon/>
            </IconButton></>}
        <IconButton onClick={openMoreMenu} title="Más acciones">
            <ExpandMoreIcon/>
        </IconButton>
        <Menu
            id="lang-menu"
            anchorEl={langMenuAnchor}
            open={langMenuOpen}
            onClose={closelangMenu}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {langLinks && langLinks.map((langlink: LangLink) => <MenuItem key={langlink.url} component="a" href={langlink.url}>
                    <ListItemText>{langlink.langname}</ListItemText>
                </MenuItem>)}
        </Menu>
        <Menu
            id="more-menu"
            anchorEl={moreMenuAnchor}
            open={moreMenuOpen}
            onClose={closeMoreMenu}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {isMobile && <>
                <MenuItem onClick={notImplemented}>
                    <ListItemIcon>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("actions.edit")}</ListItemText>
                </MenuItem>
                <MenuItem onClick={notImplemented}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("actions.history")}</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setlangMenuAnchor(moreMenuAnchor); closeMoreMenu(); }}>
                    <ListItemIcon>
                        <TranslateIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("actions.otherLangs")}</ListItemText>
                    <ListItemIcon>
                        <ChevronRightIcon fontSize="medium"/>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={notImplemented}>
                    <ListItemIcon>
                        <StarBorderIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>{t("actions.saveList")}</ListItemText>
                </MenuItem>
                <Divider />
            </>}
            <MenuItem onClick={notImplemented}>
                <ListItemIcon>
                    <PrintIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.printableVersion")}</ListItemText>
            </MenuItem>
            <MenuItem component="a" href={"/wiki/" + page + "?oldid=" + (pageinfo && pageinfo.revid)}>
                <ListItemIcon>
                    <PhishingIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.permanentLink")}</ListItemText>
            </MenuItem>
            {navigator.share && <MenuItem onClick={() => {share(); closeMoreMenu()}}>
                <ListItemIcon>
                    <ShareIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.share")}</ListItemText>
            </MenuItem>}
            <Divider />
            <MenuItem onClick={notImplemented}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.delete")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={notImplemented}>
                <ListItemIcon>
                    <LowPriorityIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.move")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={notImplemented}>
                <ListItemIcon>
                    <LockIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t("actions.protect")}</ListItemText>
            </MenuItem>
        </Menu>
    </Tabs>
        <div style={{
            overflowX: "auto",
            overflowY: "auto",
            width: isMobile ? "calc(100% - 8px)" : "calc(100% - 32px)",
            height: isMobile ? "calc(100% - 16px)" : "calc(100%  - 64px)",
            position: "absolute",
            margin: isMobile ? 0 : "10px",
            paddingTop: isMobile ? "0px" : "10px",
            paddingLeft: isMobile ? "2px" : "10px",
            paddingRight: isMobile ? "2px" : "10px",
            paddingBottom: isMobile ? "0px" : "10px"
        }}><ArticleDispatcher page={page}/></div>
    </div>;
};

export default ArticleView;
