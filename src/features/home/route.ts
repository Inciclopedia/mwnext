import {lazy} from 'react';
import ArticlePage from "@/features/home/ArticlePage";

const Home = lazy(() => import('./index'));

export default [
  {
    name: 'home',
    path: '/',
    exact: true,
    component: Home,
  },
  {
    name: 'article',
    path: '/wiki/:article',
    component: ArticlePage,
  },
  {
    name: 'index',
    path: '/w/index.php',
    Component: ArticlePage
  }
];
