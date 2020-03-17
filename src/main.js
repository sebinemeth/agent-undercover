import Vue from 'vue'
import App from './App.vue'
import Clipboard from 'v-clipboard'
import router from './router.js'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'
import firebase from 'firebase';

let app = ''
Vue.use(Clipboard)
const firebaseConfig = {
  apiKey: "AIzaSyBVbvkt6sA18SrYHz15YDZl5IoviGTZ920",
  authDomain: "agent-undercover.firebaseapp.com",
  databaseURL: "https://agent-undercover.firebaseio.com",
  projectId: "agent-undercover",
  storageBucket: "agent-undercover.appspot.com",
  messagingSenderId: "744074168072",
  appId: "1:744074168072:web:628ac2665bd168b1d08ebd",
  measurementId: "G-LJ1VM07CJ7"
};
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
firebase.auth().onAuthStateChanged(() => {
});
if (!app) {
  /* eslint-disable no-new */
  app = new Vue({
    router,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}