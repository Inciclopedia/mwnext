import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from '@mui/material/styles';
import useImage from "@/hooks/useImage";
import {useTranslation} from "react-i18next";
import {getCurrentUser, performLogin} from "@/apis/auth";
import {goURL} from "@/helpers/router";
import {useTheme} from "@mui/material";

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

export default function Login() {
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    const landing = useImage("landing.jpg");
    const logo = useImage("logo.png");
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorField, setErrorField] = useState(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const username = data.get('username').toString();
        const password = data.get('password').toString();
        if (!username) {
            setErrorMessage(t("wfMessages.noname"));
            setErrorField("username");
            return;
        }
        if (!password) {
            setErrorMessage(t("wfMessages.wrongpasswordempty"));
            setErrorField("password");
            return;
        }
        performLogin(data.get('username').toString(), data.get('password').toString()).then((result) => {
            if (result.clientlogin.status == "PASS") {
                getCurrentUser().then((response) => {
                    if (response && response.data && response.data.query && response.data.query.userinfo && response.data.query.userinfo.id !== 0) {
                        const params = new URLSearchParams(window.location.search);
                        goURL(params.get("redirect") ? decodeURIComponent(params.get("redirect")) : "/");
                    }
                }).catch((error) => {
                    setErrorMessage(t("login.failed"));
                    setErrorField("password");
                })

            } else {
                setErrorMessage(i18n.exists("wfMessages." + result.clientlogin.messagecode) ? t("wfMessages." + result.clientlogin.messagecode) : t("login.failed"));
                setErrorField("password");
            }
        }).catch((error) => {
            setErrorMessage(error.toString());
            setErrorField("password");
        })
    };

    return (
        <ThemeProvider theme={theme}>
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
                        <a href="/"><img src={logo.image} alt={process.env.REACT_APP_NAME} style={{width: '150px', height: 'auto'}} /></a>
                        <Typography component="h1" variant="h5">
                            {t('login.signIn')}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label={t('login.username')}
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={errorMessage !== null}
                                helperText={errorField == "username" && errorMessage}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={t('login.password')}
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={errorMessage !== null}
                                helperText={errorField == "password" && errorMessage}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label={t('login.rememberMe')}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {t('login.signIn')}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        {t('login.forgotPassword')}
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {t('login.signUp')}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}