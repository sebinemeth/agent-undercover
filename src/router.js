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
        requiresNonAnonym: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {

  const currentUser = firebase.auth().currentUser;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresNonAnonym = to.matched.some(record => record.meta.requiresNonAnonym);

  var authPass = (requiresAuth && currentUser) || !requiresAuth
  var nonAnonymPass = (requiresNonAnonym && currentUser && !currentUser.isAnonymous) || !requiresNonAnonym
  if (authPass && nonAnonymPass)
    next();
  else if (!authPass)
    next({ path: 'login' });
  else
    next('home');
});

export default router;