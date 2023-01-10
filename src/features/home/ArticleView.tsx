import React from 'react';
import {WikiProp} from "@/apis/parser";
import Article from "@/components/article/article";
import {Divider, Fab, ListItemIcon, ListItemText, Tab, Tabs, useMediaQuery, useTheme} from "@mui/material";
import Box from "@mui/material/Box";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from "@mui/material/IconButton";
import {Namespace} from "@/apis/siteinfo";
import useNamespaces from "@/hooks/useNamespaces";
import {goURL} from "@/helpers/router";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchor);
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(event.currentTarget);
    };
    const closeMenu = () => {
        setMenuAnchor(null);
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
            <IconButton title="Guardar en mi lista de seguimiento">
                <StarBorderIcon/>
            </IconButton></>}
        <IconButton onClick={openMenu} title="Más acciones">
            <ExpandMoreIcon/>
        </IconButton>
        <Menu
            id="more-menu"
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={closeMenu}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            {isMobile && <>
                <MenuItem onClick={closeMenu}>
                    <ListItemIcon>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={closeMenu}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Historial</ListItemText>
                </MenuItem>
                <MenuItem onClick={closeMenu}>
                    <ListItemIcon>
                        <StarBorderIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>Guardar en mi lista de seguimiento</ListItemText>
                </MenuItem>
                <Divider />
            </>}
            <MenuItem onClick={closeMenu}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Borrar</ListItemText>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
                <ListItemIcon>
                    <LowPriorityIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>Trasladar</ListItemText>
            </MenuItem>
            <MenuItem onClick={closeMenu}>
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
        }}><Article page={pagename} redirects={true}
                        prop={[WikiProp.text, WikiProp.headhtml, WikiProp.displaytitle]} useskin="vector"/></div>
    </div>;
};

export default ArticleView;
