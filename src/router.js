// import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home';
import Join from '@/views/Join';
import NotFound from '@/views/NotFound';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
});

export default router;