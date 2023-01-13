import * as React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {useTranslation} from "react-i18next";
import {Link, Typography, useTheme} from "@mui/material";
import useImage from '@/hooks/useImage';

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
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [errorField, setErrorField] = React.useState(null);

    return (
        <ThemeProvider theme={theme}>

        </ThemeProvider>
    );
}