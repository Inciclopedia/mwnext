import { lazy } from 'react';

const Login = lazy(() => import('./components/login/index'));
const Logout = lazy(() => import('./components/logout/index'));
const ForgotPassword = lazy(() => import('./components/resetpassword/index'));

export default [
  {
    name: 'login',
    path: '/login',
    exact: true,
    layout: {
      header: false,
      footer: false,
    },
    component: Login,
  },
  {
    name: 'logout',
    path: '/logout',
    exact: true,
    layout: {
      header: false,
      footer: false,
    },
    component: Logout
  },
  {
    name: 'forgotpassword',
    path: '/forgotpassword',
    exact: true,
    layout: {
      header: false,
      footer: false,
    },
    component: ForgotPassword
  }
];
