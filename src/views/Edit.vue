<template>
  <v-container>
    <div class="display-1 my-3">Paklik szerkesztése</div>
    <div>
      <div class="my-2">Privát paklijaid</div>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="deck in privateDecks" v-bind:key="deck.id">
        <v-card @click="edit(deck)">
          <v-card-title>{{deck.data().shortname}}</v-card-title>
          <v-card-actions>
            <v-icon class="mx-2">mdi-cards</v-icon>
            {{deck.data().cards.length}}
            <v-spacer />
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </div>
    <div>
      <div class="my-2">Nyilvános paklik</div>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="deck in publicDecks" v-bind:key="deck.id">
        <v-card @click="edit(deck)">
          <v-card-title>{{deck.data().shortname}}</v-card-title>
          <v-card-actions>
            <v-icon class="mx-2">mdi-cards</v-icon>
            {{deck.data().cards.length}}
            <v-spacer />
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </div>

    <v-dialog v-model="editDialog.open" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Pakli szerkesztése</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Helyszín neve" required v-model="editDialog.deck.shortName"></v-text-field>
              </v-col>
              <v-col cols="12" v-for="(i, card) in editDialog.deck.cards" v-bind:key="card">
                <v-text-field v-model="editDialog.deck.cards[i]"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog.open = false">Mégse</v-btn>
          <v-btn
            color="info"
            text
            :loading="editDialog.loading"
            :disabled="editDialog.loading"
          >Mentés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const firebase = require("firebase");
require("firebase/firestore");
export default {
  name: "Edit",
  props: ["user"],
  data: () => ({
    privateDecks: null,
    publicDecks: null,
    editDialog: {
      open: false,
      deck: {}
    }
  }),
  computed: {},
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) this.getDecks();
    });
  },
  methods: {
    async getDecks() {
      const db = firebase.firestore();
      var privateDecks = await db
        .collection("decks")
        .where("public", "==", false)
        .where("owner.uid", "==", this.user.uid);
      privateDecks.onSnapshot(ss => {
        this.privateDecks = [];
        ss.forEach(deck => {
          this.privateDecks.push(deck);
        });
      });
      var publicDecks = await db
        .collection("decks")
        .where("public", "==", true);
      publicDecks.onSnapshot(ss => {
        this.publicDecks = [];
        ss.forEach(deck => {
          this.publicDecks.push(deck);
        });
      });
    },
    edit(deck) {
      this.editDialog = {
        open: true,
        deck: deck.data(),
      }
      console.log(deck.id);
    }
  }
};
</script>