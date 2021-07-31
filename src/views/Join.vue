<template>
  <v-container>
    <pre>{{JSON.stringify(game.data(),null,3)}}</pre>
    <v-btn @click="signIn">Sign In</v-btn>
  </v-container>
</template>

<script>
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const base36 = require("base36");
export default {
  name: "Join",
  props: ["user"],
  data: () => ({
    game: null
  }),
  computed: {
    gameId() {
      if (!this.game.id) return null;
      var gameId = "";
      for (var i = this.game.id.length - 1; i >= 0; i--)
        gameId =
          this.game.id.toUpperCase()[i] +
          ((this.game.id.length - i - 1) % 4 == 0 ? " " : "") +
          gameId;
      return gameId;
    }
  },
  mounted() {
    this.getGame(this.$route.params.gameId);
  },
  methods: {
    async getGame(id) {
      const db = firebase.firestore();
      var docRef = await db.collection("games").doc(id);
      var doc = await docRef.get();
      if (!doc.exists) {
        alert("Oops");
        return;
      }
      docRef.onSnapshot(doc => {
        this.game = doc;
        this.gameRef = docRef;
        if (this.game.data().hostUser.uid == this.user.uid)
          this.$router.push("/host/" + this.game.id);
      });
    },
    async signIn() {
      var newPlayers = this.game.data().players;
      newPlayers.push({
        uid: this.user.uid,
        displayName: this.user.displayName,
        email: this.user.email
      });
      await this.gameRef.set({ players: newPlayers }, { merge: true });
      console.log(newPlayers);
    }
  }
};
</script>