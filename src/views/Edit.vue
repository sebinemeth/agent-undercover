<template>
  <v-container>
    <div class="display-1 my-3">Paklik szerkesztése</div>
    <v-btn color="info" @click="edit(null)">
      <v-icon left>mdi-plus</v-icon>Új pakli
    </v-btn>
    <div>
      <div class="subtitle-2 my-2">Privát paklijaid</div>
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
      <div class="subtitle-2 my-2">Nyilvános paklik</div>
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
              <v-col cols="12" class="subtitle-2">Pakli adatok</v-col>
              <v-col cols="12">
                <v-text-field label="Helyszín neve" v-model="editDialog.deck.shortname"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch inset v-model="editDialog.deck.public" label="Nyilvános"></v-switch>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  inset
                  v-model="editDialog.deck.readOnly"
                  label="Csak olvasható"
                  :disabled="!editDialog.deck.public"
                ></v-switch>
              </v-col>
              <v-col cols="12" class="subtitle-2">Szerepek</v-col>
              <v-col v-for="(card, i) in editDialog.deck.cards" :key="card" class="shrink">
                <v-chip close @click:close="editDialog.deck.cards.splice(i, 1)">
                  <!--<v-icon left v-text="selection.icon"></v-icon>-->
                  {{ card }}
                </v-chip>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editDialog.newRole"
                  append-outer-icon="mdi-plus-circle"
                  clearable
                  label="Új szerep"
                  type="text"
                  @click:append-outer="()=>{editDialog.deck.cards.push(editDialog.newRole); editDialog.newRole = null}"
                ></v-text-field>
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
            @click="saveDeck"
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
      console.log(deck);
      this.editDialog = {
        open: true,
        deck: deck ? deck.data() : {cards: []},
        deckId: deck ? deck.id : null
      };
      if (deck) console.log(deck.data());
    },
    async saveDeck() {
      this.editDialog.loading = true;
      const db = firebase.firestore();
      var result;
      if (!this.editDialog.deckId) {
        console.log(this.user)
        this.editDialog.deck.owner = {
          uid: this.user.uid
        }
        result = await db.collection("decks").add(this.editDialog.deck);
      } else {
        var docRef = await db.collection("decks").doc(this.editDialog.deckId);
        result = await docRef.set(this.editDialog.deck, {
          merge: true
        });
      }
      console.log(result);
      this.editDialog.open = false;
    }
  }
};
</script>