import * as React from 'react';
import {KeyboardEvent, useEffect, useState} from 'react';
import {alpha, styled} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useTranslation} from "react-i18next";
import useAccount from "@/hooks/useAccount";
import {goURL} from "@/helpers/router";
import useFile from "@/hooks/useFile";
import Button from "@mui/material/Button";
import {Autocomplete, autocompleteClasses, useMediaQuery, useTheme} from "@mui/material";
import TextField from "@mui/material/TextField";
import {autocomplete, AutocompleteResult} from "@/apis/autocomplete";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));


export default function MainAppBar(props: {drawerOpen: boolean, setDrawerOpen: (value: boolean) => void}) {
    const theme = useTheme();
    const {drawerOpen, setDrawerOpen} = props;
    const [title, setTitle] = useState(process.env.REACT_APP_NAME);
    useEffect(() => {
        window.addEventListener('message', (ev: MessageEvent) => {
            if (ev && ev.data && typeof(ev.data) === "string" && ev.data.startsWith("title ")) {
                document.title = ev.data.replace("title ", "");
                setTitle(document.title);
                document.title = document.title ? document.title + " - " + process.env.REACT_APP_NAME : process.env.REACT_APP_NAME;
            }
        });
    }, []);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { t } = useTranslation();
    const { account } = useAccount();
    const { file, error } = useFile("File:Wiki.png");
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly AutocompleteResult[]>([]);
    const [search, setSearch ] = useState("");
    const [autocompleteText, setAutocompleteText] = useState(t("appBar.loading"));
    const loading = open && search.length > 0 && options.length === 0;
    const [searchMobile, setSearchMobile] = useState(false);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id={menuId}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {account && <>
            <MenuItem onClick={handleMenuClose}>{account.name}</MenuItem>
            <MenuItem onClick={handleMenuClose}>{t('appBar.userTalk')}</MenuItem>
            <MenuItem onClick={handleMenuClose}>{t('appBar.userPreferences')}</MenuItem>
            <MenuItem onClick={() => goURL('/logout')}>{t('appBar.logout')}</MenuItem>
            </>}
            {!account && <>
            <MenuItem onClick={handleMenuClose}>{t('appBar.createAccount')}</MenuItem>
            <MenuItem onClick={() => goURL('/login')}>{t('appBar.login')}</MenuItem>
            </>}
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            id={mobileMenuId}
            keepMounted
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {account && <>
                <MenuItem onClick={handleMenuClose}>{account.name}</MenuItem>
                <MenuItem onClick={handleMenuClose}>{t('appBar.userTalk')}</MenuItem>
                <MenuItem onClick={handleMenuClose}>{t('appBar.userPreferences')}</MenuItem>
                <MenuItem onClick={() => goURL('/logout')}>{t('appBar.logout')}</MenuItem>
            </>}
            {!account && <>
                <MenuItem onClick={handleMenuClose}>{t('appBar.createAccount')}</MenuItem>
                <MenuItem onClick={() => goURL('/login')}>{t('appBar.login')}</MenuItem>
            </>}
        </Menu>
    );

    let throttle: ReturnType<typeof setTimeout> = null;

    useEffect(() =>  {
        setAutocompleteText(t("appBar.loading"));
        if (throttle !== null) {
            clearTimeout(throttle);
            throttle = null;
        }
        if (search != "" && search.length > 0) {
            throttle = setTimeout(() => {
                setOptions([]);
                autocomplete(search, 10).then((results) => {
                    if (results.length === 0) {
                        setAutocompleteText(t("appBar.noResults"));
                    }
                    setOptions(results);
                }).catch(() => {
                    setOptions([]);
                })
            }, 500);
        }
    }, [search])


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color="inherit" sx={{ zIndex: (theme) => theme.zIndex.drawer }}>
                <Toolbar>
                    {isMobile && <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon />
                    </IconButton>}
                    {(!isMobile || !title) && <a href="/" title={process.env.REACT_APP_NAME}>
                    {file !== null && <img src={file} alt={process.env.REACT_APP_NAME} style={{width: 'auto', height: '64px', margin: "5px"}} />}
                    {file === null && <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        {process.env.REACT_APP_NAME}
                    </Typography>}
                    </a>}
                    {!searchMobile && <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{marginLeft: '5px'}}
                    >
                        <span dangerouslySetInnerHTML={{__html:  title}}></span>
                    </Typography>}
                    {(!isMobile || !searchMobile) && <Box sx={{ flexGrow: 5 }} />}
                    {(!isMobile || searchMobile) &&
                    <Search>
                        <Autocomplete
                            disablePortal
                            id="searchBox"
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            isOptionEqualToValue={(option: AutocompleteResult, value: AutocompleteResult | string) => (option == value || (option as AutocompleteResult).page === (value as AutocompleteResult).page)}
                            getOptionLabel={(option: string) => ((option as AutocompleteResult).page || option)}
                            options={options}
                            loading={loading}
                            loadingText={<>{autocompleteText}</>}
                            freeSolo
                            onInputChange={(event: React.SyntheticEvent, value: string, reason: string) => {
                                if (!value) {
                                    setSearch("");
                                } else {
                                    setSearch(value);
                                }
                            }}
                            onChange={(event: React.SyntheticEvent, value: AutocompleteResult | string) => {
                                if ((value as AutocompleteResult).page) {
                                    goURL("/wiki/" + (value as AutocompleteResult).page);
                                } else {
                                    goURL("/wiki/" + value);
                                }
                            }}
                            sx={{ minWidth: "100px", [`& .${autocompleteClasses.popupIndicator}`]: {
                                    transform: "none"
                                }}}
                            popupIcon={<SearchIcon/>}
                             renderInput={(params) => <TextField
                                inputRef={input => input && searchMobile && input.focus()}
                                variant="standard" {...params} placeholder={t('appBar.search')} sx={{
                                padding: theme.spacing(1, 1, 1, 0),
                                transition: theme.transitions.create('width'),
                                minWidth: "100px"
                            }} onKeyDown={(event: KeyboardEvent) => {
                                if (event.code === "Enter" || event.code === "NumpadEnter")  {
                                    goURL("/wiki/" + search);
                                }
                            }}/>}
                        />

                    </Search>}
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {account !== null && <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>}
                        {account !== null && <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>}

                        {account !== null && <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>}
                        {account === null && <Button
                            aria-label="account of current user"
                            onClick={() => goURL('/signup')}
                            color="inherit"
                            style={{marginLeft: "5px", marginRight: "5px"}}
                        >
                            {t('appBar.createAccount')}
                        </Button>}
                        {account === null && <Button
                            aria-label="account of current user"
                            onClick={() => goURL('/login')}
                            color="primary"
                            variant="contained"
                            style={{marginLeft: "5px", marginRight: "5px"}}
                            disableElevation
                        >
                            {t('appBar.login')}
                        </Button>}
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        {isMobile && <IconButton color={searchMobile ? "primary" : "inherit"} onClick={() => {
                            setSearchMobile(!searchMobile);

                        }}><SearchIcon /></IconButton>}
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}