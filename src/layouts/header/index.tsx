import React, {ReactElement, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectDisplayLayout} from '@/store/slices/layoutSlice';
import MainAppBar from "@/components/appbar/appbar";
import {
  Backdrop,
  createTheme,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import UpdateIcon from '@mui/icons-material/Update';

1
interface IMenuItem {
  name: string;
  href: string;
  icon: ReactElement;
}

export const MENUS: Array<Array<IMenuItem>> = [
  [{
    name: 'Home',
    href: '/',
    icon: <HomeIcon />,
  },{
    name: 'Recent Changes',
    href: '/wiki/Special:RecentChanges',
    icon: <UpdateIcon />,
  }]
];
const theme = createTheme();

const Header: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [ drawerOpen, setDrawerOpen ] = useState(false);
  const { header } = useSelector(selectDisplayLayout);
  if (!header) {
    return null;
  }
  return <>
      <MainAppBar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 1 }}
          open={drawerOpen}
          onClick={() => setDrawerOpen(false)}
      />
      <SwipeableDrawer hideBackdrop variant={isMobile ? "temporary" : "permanent"} open={drawerOpen}
                       onOpen={() => (setDrawerOpen(true))}  style={{ pointerEvents: 'none' }}
      onClose={() => (setDrawerOpen(false))} PaperProps={
        {sx: {
          marginTop: "74px", marginBottom: "10px", padding: "20px", width: "250px",
            height: "calc(100% - 82px)"
        }
        }}>
        <List  style={{ pointerEvents: 'all' }}>
          {MENUS.map((menu, index) => (
              <>
              {index != 0 && <Divider/>}
              {menu.map((menuitem, idx) => (
                <ListItem key={menuitem.name} disablePadding>
                  <ListItemButton  component="a" href={menuitem.href}>
                    {menuitem.icon && <ListItemIcon>
                      {menuitem.icon}
                    </ListItemIcon>}
                    <ListItemText primary={menuitem.name} />
                  </ListItemButton>
                </ListItem>
              ))}
              </>
          ))}
        </List>

      </SwipeableDrawer>

  </>;
};

export default Header;
