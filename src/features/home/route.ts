import {lazy} from 'react';
import ArticleView from "@/features/home/ArticleView";

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
    component: ArticleView,
  }
];
