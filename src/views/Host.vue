<template>
  <v-container v-if="game">
    <v-card class="mx-auto my-3" max-width="400">
      <v-card-text class="p-2">Játék azonosítója:</v-card-text>
      <v-alert color="info" class="display-1 text-center mx-2">{{gameId}}</v-alert>
      <v-card-actions>
        <v-spacer />
        <v-btn
          icon
          v-clipboard="gameId"
          v-clipboard:success="clipboardSuccessHandler"
          v-clipboard:error="clipboardErrorHandler"
        >
          <v-icon>mdi-numeric</v-icon>
        </v-btn>
        <v-btn
          icon
          v-clipboard="'https://agent-undercover.web.app/#/join/'+game.id"
          v-clipboard:success="clipboardSuccessHandler"
          v-clipboard:error="clipboardErrorHandler"
        >
          <v-icon>mdi-link</v-icon>
        </v-btn>
        <v-btn v-if="shareCapable" icon color="info" @click="share">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-stepper v-model="stepper" vertical>
      <v-stepper-step
        :complete="stepper > 1"
        step="1"
      >Várakozás játékosokra ({{game.data().players.length}}/{{game.data().options.numberOfPlayers}})</v-stepper-step>

      <v-stepper-content step="1">
        <v-card>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="game.data().full" @click="stepper = 2">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 2" step="2">Configure analytics for this app</v-stepper-step>

      <v-stepper-content step="2">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="stepper = 3">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="stepper > 3" step="3">Select an ad format and name ad unit</v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="stepper = 4">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step step="4">View setup instructions</v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="stepper = 1">Continue</v-btn>
        <v-btn text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const base36 = require("base36");
export default {
  name: "Host",
  data: () => ({
    stepper: 1,
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
    },
    shareCapable() {
      return navigator.share;
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
        console.log(doc.data());
      });
    },
    async share() {
      await navigator.share({
        title: "Agent Undercover játékmeghívás",
        text: "Csatlakozz a játékhoz!",
        url: "https://agent-undercover.web.app/#/join/" + this.game.id
      });
    }
  }
};
</script>