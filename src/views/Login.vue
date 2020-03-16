<template>
  <div class="container">
    <v-row>
      <v-col xs="12" sm="12" md="12" lg="6">
        <v-card class="mx-auto">
          <v-card-title class="headline mb-3">
            <v-icon class="mr-2">mdi-google</v-icon>Google bejelentkezés
          </v-card-title>
          <v-card-subtitle>Az alkalmazás hozzáférést kap a Google-fiókod egyedi azonosítójához, az emailcímedhez és a nevedhez. Az alkalmazás helyes működése érdekében ezt a lehetőséget ajánljuk.</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="googleLogin">bejelentkezés</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col xs="12" sm="12" md="12" lg="6">
        <v-card class="mx-auto">
          <v-card-title class="headline mb-3">
            <v-icon class="mr-2">mdi-account</v-icon>Névtelen bejelentkezés
          </v-card-title>
          <v-card-subtitle>Az alkalmazás nem fér hozzá semmilyen személyes adatodhoz, minden bejelentkezésnél meg kell adnod egy nevet, amit a játékban használni szeretnél. A teljes játékélmény érdekében nem ajánljuk ezt a lehetőséget.</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="anonymLogin">bejelentkezés</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import firebase from "firebase";
// @ is an alias to /src
export default {
  name: "Login",
  props: ["user"],
  data: () => ({
    drawer: null,
    fallback: "home"
  }),
  mounted() {
    firebase.auth().onAuthStateChanged(this.redirect);
  },
  methods: {
    redirect(user) {
      if (user) this.$router.replace("home");
    },
    googleLogin() {
      this.login("google");
    },
    anonymLogin() {
      this.login();
    },
    async login(method) {
      var result;
      try {
        switch (method) {
          case "google":
            var google = new firebase.auth.GoogleAuthProvider();
            result = await firebase.auth().signInWithPopup(google);
            break;
          default:
            result = await firebase.auth().signInAnonymously();
            break;
        }
        var user = result.user;
        console.log("logged in", method ? "with " + method : "anonymously");
      } catch (error) {
        alert(error.message)
        console.log(error);
      }
    }
  }
};
</script>