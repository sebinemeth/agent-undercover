// import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home';
import Join from '@/views/Join';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    }
  ]
});

export default router;