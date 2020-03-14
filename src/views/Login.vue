<template>
  <div class="container">
    <div class="headline">Bejelentkezés</div>
    <v-row>
      <v-col md-6>
        <v-btn @click="googleLogin">Google</v-btn>
      </v-col>
    </v-row>
    <v-btn @click="anonymLogin">Anonym</v-btn>
  </div>
</template>


<script>
import firebase from "firebase";
// @ is an alias to /src
export default {
  name: "Login",
  data: () => ({
    drawer: null
  }),
  mounted() {
    this.redirect();
  },
  methods: {
    async redirect() {
      var user = await firebase.auth().currentUser;
      console.log(user)
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
        this.$router.replace("home");
      } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(error);
      }
    }
  }
};
</script>