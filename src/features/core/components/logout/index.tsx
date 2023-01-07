import * as React from "react";
import {useEffect, useState} from "react";
import "react";
import {performLogout} from "@/apis/auth";
import {goURL} from "@/helpers/router";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import useImage from "@/hooks/useImage";
import {useDispatch} from "react-redux";


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href={process.env.REACT_APP_URL}>
                {process.env.REACT_APP_NAME}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function Logout() {
    const { t } = useTranslation();
    const landing = useImage("landing.jpg");
    const logo = useImage("logo.png");

    const [ logoutFailed, setLogoutFailed ] = useState(false);

    useEffect(() => {
        performLogout().then(() => {
            goURL('/login');
        }).catch(() => {
            setLogoutFailed(true);
        })
    }, []);

    return <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url('${landing.image}');`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={logo.image} alt={process.env.REACT_APP_NAME} style={{width: '150px', height: 'auto'}} />
                    <Typography component="h1" variant="h5">
                        {logoutFailed ? t('logout.failed') : t('logout.inProgress')}
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    </ThemeProvider>
}