<template>
  <v-app>
    <v-overlay :value="user === undefined">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Kezdőlap</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="user && !user.isAnonymous">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Új játék</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="user">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Csatlakozás</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-if="user && !user.isAnonymous">
          <v-list-item-action>
            <v-icon>mdi-cards</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Szerkesztő</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-help</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Útmutató</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-footer>
          <v-col class="text-center overline" cols="12">
            {{ new Date().getFullYear() }} —
            <span>nemethsebi</span>
          </v-col>
        </v-footer>
      </template>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="orbitron">Agent Undercover</v-toolbar-title>
      <v-spacer />
      <template v-if="user">
        <v-menu offset-y>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip left>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-on="{ ...tooltip, ...menu }" class="ma-2">
                  <template v-if="!user.isAnonymous">
                    <v-avatar size="28">
                      <img :src="user.photoURL" />
                    </v-avatar>
                  </template>
                  <template v-else>
                    <v-icon>mdi-account</v-icon>
                  </template>
                </v-btn>
              </template>
              <span>
                <template v-if="!user.isAnonymous">{{firstName}}</template>
                <template v-else>Névtelen</template>
              </span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item @click="signOut">
              <v-list-item-title>Kijelentkezés</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-content>
      <v-container class="fill-height" fluid>
        <router-view :user="user" />
      </v-container>
    </v-content>
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
    user: undefined
  }),
  computed: {
    firstName() {
      if (!this.user || this.user.isAnonymous) return null;
      return this.user.displayName.split(" ")[0];
    }
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
        this.user = user;
      } else {
        this.user = null;
      }
      console.log(this.user);
    },
    async signOut() {
      var res = await firebase.auth().signOut();
      this.$router.go();
    }
  }
};
</script>
<style>
.orbitron {
  font-family: "Orbitron", sans-serif !important;
}
.o-headline {
  font-family: "Orbitron", sans-serif !important;
  font-size: 2em;
}
</style>