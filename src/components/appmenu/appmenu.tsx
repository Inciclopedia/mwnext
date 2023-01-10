import {Collapse, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {ReactElement, useState} from "react";
import HomeIcon from "@mui/icons-material/Home";
import UpdateIcon from "@mui/icons-material/Update";
import usePageSource from "@/hooks/usePageSource";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

interface IMenuItem {
    name: string;
    href: string;
    icon: ReactElement;
}

export const MENUS: Array<Array<IMenuItem>> = [
    [{
        name: 'Portada',
        href: '/',
        icon: <HomeIcon />,
    },{
        name: 'Cambios recientes',
        href: '/wiki/Special:RecentChanges',
        icon: <UpdateIcon />,
    }]
];
export default function AppMenu() {
    const menus: Array<Array<IMenuItem>> = [];
    const groups: Array<string> = [];
    const { source: mwnextsidebar } = usePageSource("MediaWiki:Mwnext-sidebar");
    const { source: standardsidebar } = usePageSource("MediaWiki:Sidebar");
    const [ opengroups, setOpengroups ] = useState([]);
    const sidebar = mwnextsidebar || standardsidebar;
    if (!sidebar) {
        return <></>;
    }
    let curGroup: Array<IMenuItem> = [];
    sidebar.split("\n").forEach((line) => {
        if (line.startsWith("**")) {
            const entry = line.substring(2).split("|");
            if (entry.length == 0) {
                return;
            }
            const name = entry.length > 1 ? entry[1].trim() : entry[0].trim();
            let href = entry[0].trim();
            href = href.startsWith("http") ? href : "/wiki/" + href;
            curGroup.push({
                name, href, icon: <Icon>{entry.length > 2 ? entry[2].trim() : ""}</Icon>
            });
        } else if (line.startsWith("*")) {
            if (curGroup.length > 0) {
                menus.push(curGroup);
            }
            groups.push(line.substring(1).trim());
            curGroup = [];
        }
    });
    menus.push(curGroup);
    return <div style={{ pointerEvents: 'all', height: "100%", overflow: "auto" }}><List>
        {groups.map((group, index) => {
            const items = <>{menus[index].map((menuitem, idx) => (
                    <ListItem key={menuitem.name} disablePadding>
                        <ListItemButton  component="a" href={menuitem.href} sx={{
                            "&:visited": {color:0},
                            "pl": group === "navigation" ? 1 : 4
                        }}>
                            {menuitem.icon && <ListItemIcon>
                                {menuitem.icon}
                            </ListItemIcon>}
                            <ListItemText primary={menuitem.name} />
                        </ListItemButton>
                    </ListItem>
                ))}</>;
            return group == "navigation" ? items : <React.Fragment key={group}><ListItemButton onClick={() => {
                if (opengroups.includes(index)) {
                    const filtered = opengroups.filter((it) => it != index);
                    setOpengroups(filtered);
                } else {
                    const gps = opengroups.map((it) => it);
                    gps.push(index);
                    setOpengroups(gps);
                }
            }}>
                <ListItemText primary={group} />
                {opengroups.includes(index) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton><Collapse in={opengroups.includes(index)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {items}
                </List>
            </Collapse></React.Fragment>
        })}
    </List></div>
}