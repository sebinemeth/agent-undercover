<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="orbitron">Agent Undercover</v-toolbar-title>
      <v-spacer/>
      <template v-if="user">
        <template v-if="!user.isAnonymous">
          <v-avatar size="36" class="mx-3"><img :src="user.photoURL"></v-avatar>
        </template>
        <v-btn text @click="signOut">kilépés</v-btn>
      </template>

    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <router-view :user="user" />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
export default {
  name: "App",

  data: () => ({
    drawer: null,
    user: null
  }),
  computed: {
  },
  mounted() {
    this.$vuetify.theme.dark = true;
    firebase.auth().onAuthStateChanged(this.setUser);
  },
  methods: {
    setUser(user) {
      if (user) {
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        this.user = user
      } else {
        this.user = null
      }
      console.log(this.user)
    },
    async signOut() {
      var res = await firebase.auth().signOut();
      this.$router.go();
    }
  }
};
</script>
<style scoped>
.orbitron {
  font-family: "Orbitron", sans-serif;
}
</style>