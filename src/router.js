import firebase from 'firebase';
import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/views/Home';
import Login from '@/views/Login';
import Host from '@/views/Host';

Vue.use(Router);

const router = new Router({
  routes: [
    /*{
      path: '*',
      redirect: '/login'
    },*/
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/host/:gameId',
      name: 'Host',
      component: Host,
      meta: {
        requiresAuth: true,
      }
    }
  ]
});

router.beforeEach((to, from, next) => {

  const currentUser = firebase.auth().currentUser;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser)
    next("login?callback="+to.path.substring(1));
  else
    next();
});

export default router;