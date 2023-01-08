import React, {Suspense} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {history} from '@/store';
import {ConnectedRouter} from 'connected-react-router';
import {ToastContainer} from 'react-toastify';
import {Helmet} from 'react-helmet-async';

import Layout from '@/layouts';
import PageLoading from '@/components/page-loading';

// multi language
import '@/locales/i18n';
// load Toast styles
import 'react-toastify/dist/ReactToastify.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

// load app SCSS styles
import(`./themes/${process.env.REACT_APP_FLAVOR}/styles/App.scss`);

const theme = createTheme();

const ReactApp: React.FC = () => {
  return (
    <Router>
      <Helmet titleTemplate={"%s - " + process.env.REACT_APP_NAME} defaultTitle={process.env.REACT_APP_NAME}>
        <meta name="description" content="Alternative client for MediaWiki" />
      </Helmet>
      <CssBaseline/>

      <ConnectedRouter history={history}>
        <Suspense fallback={<PageLoading show />}>
            <ThemeProvider theme={theme}>
                <Layout />
            </ThemeProvider>
          <PageLoading />
        </Suspense>
      </ConnectedRouter>

      <ToastContainer />
    </Router>
  );
};

export default ReactApp;
