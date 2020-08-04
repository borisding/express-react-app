import { Layout } from '../componets';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = [
  {
    key: 'home',
    path: '/',
    exact: true,
    component: Home
  },
  {
    key: 'not-found',
    path: '*',
    component: NotFound
  }
];

export default [
  {
    component: Layout,
    routes
  }
];
