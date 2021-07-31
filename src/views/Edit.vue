<template>
  <v-container>
    <div class="display-1 my-3">Paklik szerkesztése</div>
    <v-btn color="info" @click="edit(null)">
      <v-icon left>mdi-plus</v-icon>Új pakli
    </v-btn>
    <div>
      <div class="subtitle-2 my-2">Privát paklijaid</div>
      <v-row>
        <v-col cols="12" v-if="privateDecks && privateDecks.length == 0">
          <v-card>
            <v-card-text>Nincs megjeleníthető pakli.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="deck in privateDecks" v-bind:key="deck.id">
          <v-card @click="edit(deck)">
            <v-card-title>{{deck.data().shortname}}</v-card-title>
            <v-card-actions>
              <v-icon class="mx-2">mdi-cards</v-icon>
              {{deck.data().cards.length}}
              <v-spacer />
              <v-icon class="ma-2" v-if="editable(deck.data())">mdi-pencil</v-icon>
              <v-icon class="ma-2" v-else>mdi-eye</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div>
      <div class="subtitle-2 my-2">Nyilvános paklik</div>
      <v-row>
        <v-col cols="12" v-if="publicDecks && publicDecks.length == 0">
          <v-card>
            <v-card-text>Nincs megjeleníthető pakli.</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="deck in publicDecks" v-bind:key="deck.id">
          <v-card @click="edit(deck)">
            <v-card-title>{{deck.data().shortname}}</v-card-title>
            <v-card-actions>
              <v-icon class="mx-2">mdi-cards</v-icon>
              {{deck.data().cards.length}}
              <v-spacer />
              <v-icon class="ma-2" v-if="editable(deck.data())">mdi-pencil</v-icon>
              <v-icon class="ma-2" v-else>mdi-eye</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="editDialog.open" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Pakli szerkesztése</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="subtitle-2">Pakli tulajdonosa</v-col>
              <v-col cols="12">
                <v-card
                  flat
                  color="grey darken-4"
                  class="pa-2 d-flex flex-row align-center"
                  v-if="editDialog.deck.owner"
                >
                  <v-list-item two-line>
                    <v-list-item-avatar>
                      <v-img :src="editDialog.deck.owner.photoURL"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{editDialog.deck.owner.displayName}}</v-list-item-title>
                      <v-list-item-subtitle>{{editDialog.deck.owner.email}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-col>
              <v-col cols="12" class="subtitle-2">Pakli adatok</v-col>
              <v-col cols="12 py-0">
                <v-text-field
                  label="Helyszín neve"
                  :disabled="!editable(editDialog.deck)"
                  v-model="editDialog.deck.shortname"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-switch
                  inset
                  :disabled="!editable(editDialog.deck)"
                  v-model="editDialog.deck.public"
                  label="Nyilvános"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <v-switch
                  inset
                  v-model="editDialog.deck.readOnly"
                  label="Csak olvasható"
                  :disabled="!editable(editDialog.deck) || !editDialog.deck.public"
                ></v-switch>
              </v-col>
              <v-col cols="12" class="subtitle-2">Szerepek</v-col>
              <v-row class="px-4">
                <v-col v-for="(card, i) in editDialog.deck.cards" :key="card" class="shrink pa-1">
                  <v-chip
                    v-if="editable(editDialog.deck)"
                    close
                    @click:close="editDialog.deck.cards.splice(i, 1)"
                  >{{ card }}</v-chip>
                  <v-chip v-else>{{card}}</v-chip>
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-text-field
                  v-if="editable(editDialog.deck)"
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
          <template v-if="editable(editDialog.deck)">
            <v-btn text @click="editDialog.confirmDelete = true" color="red">Törlés</v-btn>
            <v-btn text @click="editDialog.open = false">Mégse</v-btn>
            <v-btn
              color="info"
              text
              :loading="editDialog.loading"
              :disabled="editDialog.loading"
              @click="saveDeck"
            >Mentés</v-btn>
          </template>
          <template v-else>
            <v-btn text @click="editDialog.open = false">Bezárás</v-btn>
          </template>
        </v-card-actions>
      </v-card>
      <v-dialog v-model="editDialog.confirmDelete" max-width="290">
        <v-card>
          <v-card-title class="headline">Pakli törlése</v-card-title>
          <v-card-text>Biztosan törölni szeretnéd a paklit? Ez a művelet nem vonható vissza.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="editDialog.confirmDelete = false">Mégse</v-btn>
            <v-btn color="red" text @click="deleteDeck">Törlés</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    editable(deck) {
      if (!deck) return false;
      return !deck.readOnly || this.user.uid == deck.owner.uid;
    },
    edit(deck) {
      console.log(deck);
      this.editDialog = {
        open: true,
        deck: deck
          ? deck.data()
          : {
              cards: [],
              owner: {
                uid: this.user.uid,
                displayName: this.user.displayName,
                photoURL: this.user.photoURL,
                email: this.user.email
              },
              public: true,
              readOnly: true
            },
        deckId: deck ? deck.id : null,
        confirmDelete: false
      };
      if (deck) console.log(deck.data());
    },
    async saveDeck() {
      this.editDialog.loading = true;
      const db = firebase.firestore();
      var result;
      if (!this.editDialog.deckId) {
        console.log(this.editDialog.deck);
        /*this.editDialog.deck.owner = {
          uid: this.user.uid,
          displayName: this.user.displayName,
          photoURL: this.user.photoURL
        };*/
        result = await db.collection("decks").add(this.editDialog.deck);
      } else {
        var docRef = await db.collection("decks").doc(this.editDialog.deckId);
        result = await docRef.set(this.editDialog.deck, {
          merge: true
        });
      }
      console.log(result);
      this.editDialog.open = false;
    },
    async deleteDeck() {
      this.editDialog.deleting = true;
      const db = firebase.firestore();
      var result;
      result = await db
        .collection("decks")
        .doc(this.editDialog.deckId)
        .delete();
      this.editDialog.open = false;
    }
  }
};
</script>