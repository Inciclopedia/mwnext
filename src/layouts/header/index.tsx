import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {selectDisplayLayout} from '@/store/slices/layoutSlice';
import MainAppBar from "@/components/appbar/appbar";
import {Backdrop, SwipeableDrawer, useMediaQuery, useTheme} from "@mui/material";
import AppMenu from "@/components/appmenu/appmenu";


const Header: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {header} = useSelector(selectDisplayLayout);
    if (!header) {
        return null;
    }
    return <>
        <MainAppBar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen}/>
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer - 1}}
            open={drawerOpen}
            onClick={() => setDrawerOpen(false)}
        />
        <SwipeableDrawer hideBackdrop variant={isMobile ? "temporary" : "permanent"} open={drawerOpen}
                         onOpen={() => (setDrawerOpen(true))} style={{pointerEvents: 'none'}}
                         onClose={() => (setDrawerOpen(false))} PaperProps={
            {
                sx: {
                    marginTop: "74px", marginBottom: "10px", padding: "20px", width: "250px",
                    height: "calc(100% - 82px)"
                }
            }}>
            <AppMenu/>
        </SwipeableDrawer>

    </>;
};

export default Header;
