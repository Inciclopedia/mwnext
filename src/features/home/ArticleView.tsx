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
import IconButton from "@mui/material/IconButton";
import {Namespace} from "@/apis/siteinfo";
import useNamespaces from "@/hooks/useNamespaces";
import {goURL} from "@/helpers/router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArticleDispatcher from "@/features/home/ArticleDispatcher";
import useParser from "@/hooks/useParser";
import {LangLink, WikiProp} from "@/apis/parser";

export interface ArticleViewProps {
    page?: string;
    mwnextHideTitle?: boolean;
}

const ArticleView: React.FC<ArticleViewProps> = (props: ArticleViewProps) => {
    const {page} = props;
    const theme = useTheme();
    const pagename = page || decodeURIComponent(window.location.pathname.split("/").slice(2).join('/')).replace(" ", "_");
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const {namespaces} = useNamespaces();
    const {parsed: langinfo} = useParser({ page, prop: [WikiProp.langlinks] });
    const langLinks = langinfo && langinfo.langlinks;
    const [moreMenuAnchor, setMoreMenuAnchor] = React.useState<null | HTMLElement>(null);
    const moreMenuOpen = Boolean(moreMenuAnchor);
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
                          sx={{position: "fixed", top: "100%", left: "100%", marginLeft: "-96px", marginTop: "-96px"}}>
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
        {!isMobile && <><IconButton title="Editar">
            <EditIcon/>
        </IconButton>
            <IconButton title="Historial">
                <HistoryIcon/>
            </IconButton>
        {langLinks && langLinks.length > 0 && <IconButton onClick={openlangMenu} title="Otros idiomas">
                <TranslateIcon/>
            </IconButton>}
            <IconButton title="Guardar en mi lista de seguimiento">
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
            {langLinks && langLinks.map((langlink: LangLink) => <MenuItem key={langlink.url} onClick={() => {
                window.location.href = langlink.url;
            }}>
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
                <MenuItem onClick={closeMoreMenu}>
                    <ListItemIcon>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={closeMoreMenu}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Historial</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => { setlangMenuAnchor(moreMenuAnchor); closeMoreMenu(); }}>
                    <ListItemIcon>
                        <TranslateIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Otros idiomas</ListItemText>
                    <ListItemIcon>
                        <ChevronRightIcon fontSize="medium"/>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={closeMoreMenu}>
                    <ListItemIcon>
                        <StarBorderIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Guardar en mi lista de seguimiento</ListItemText>
                </MenuItem>
                <Divider />
            </>}
            <MenuItem onClick={closeMoreMenu}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Borrar</ListItemText>
            </MenuItem>
            <MenuItem onClick={closeMoreMenu}>
                <ListItemIcon>
                    <LowPriorityIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Trasladar</ListItemText>
            </MenuItem>
            <MenuItem onClick={closeMoreMenu}>
                <ListItemIcon>
                    <LockIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Proteger</ListItemText>
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
