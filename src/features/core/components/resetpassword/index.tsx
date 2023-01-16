import * as React from 'react';
import { useEffect, useState } from "react";
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
import { ThemeProvider } from '@mui/material/styles';
import useImage from "@/hooks/useImage";
import { useTranslation } from "react-i18next";
import { getCurrentUser, performLogin, performReset } from "@/apis/auth";
import { goURL } from "@/helpers/router";
import { useTheme } from "@mui/material";

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

export default function ResetPassword() {
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
        const email = data.get('email').toString();
        let user: string;
        if (!username && !email) {
            setErrorMessage(t("wfMessages.wrongresetinput"));
            setErrorField("username");
            return;
        }

        setErrorMessage(null)
        setErrorField(null)

        if (username) {
            user = username;
        } else if (email) {
            user = email;
        }

        performReset(user).then(() => {
            goURL('/');
            // Implemente message notify user.
        }).catch(() => {
            // implement catch
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
                        <a href="/"><img src={logo.image} alt={process.env.REACT_APP_NAME} style={{ width: '150px', height: 'auto' }} /></a>
                        <Typography component="h1" variant="h5">
                            {t('ui.resetPassword')}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
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
                                fullWidth
                                id="email"
                                label={t('ui.emailAddress')}
                                name="email"
                                autoComplete="email"
                                error={errorMessage !== null}
                                helperText={errorField == "email" && errorMessage}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {t('ui.resetPassword')}
                            </Button>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}