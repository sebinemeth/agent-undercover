<template>
  <v-container>
    <div class="o-headline info--text">Agent Undercover</div>
    <div class="subtitle-1 mb-3">Tégla a sorainkban!</div>
    <v-alert
      border="left"
      color="info"
      colored-border
      dense
      dismissible
      @click="$router.push('help')"
    >
      <span class="my-1 d-inline-block">Nem játszottál még? Olvasd el az útmutatót!</span>
      <v-btn text @click="$router.replace('help')" class="float-right">mutasd</v-btn>
    </v-alert>

    <v-row>
      <v-col cols="12" lg="6" v-if="user && !user.isAnonymous">
        <v-card cursor="pointer" @click.stop="hostDialog.open = true">
          <v-card-title class="headline mb-3">Új játék</v-card-title>
          <v-card-subtitle>Te leszel a játékvezető, de neked is lehetőséged lesz játszani. A játékbeállítások megadása után a létrejött játék azonosítóját neked kell megosztanod a többiekkel, hogy csatlakozhassanak.</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn text>tovább</v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="hostDialog.open" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Új játék</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field disabled :value="user.displayName" label="Játékvezető"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      type="number"
                      label="Játékosok száma*"
                      required
                      hint="A játékosok pontos száma."
                      persistent-hint
                      v-model="hostDialog.numberOfPlayers"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      type="number"
                      label="Kémek száma*"
                      v-model="hostDialog.numberOfSpies"
                      persistent-hint
                    ></v-text-field>
                  </v-col>
                  <!--<v-col cols="12">
                    <v-text-field
                      label="Jelszó"
                      :append-icon="hostDialog.showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="hostDialog.showPwd ? 'text' : 'password'"
                      hint="A játékot jelszóval védheted."
                      persistent-hint
                      v-model="hostDialog.password"
                      @click:append="hostDialog.showPwd = !hostDialog.showPwd"
                    ></v-text-field>
                  </v-col>-->
                </v-row>
              </v-container>
              <small>*kötelező mező</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="hostDialog.open = false">Mégse</v-btn>
              <v-btn
                color="info"
                text
                :loading="hostDialog.loading"
                :disabled="hostDialog.loading"
                @click="generateHost"
              >Indítás</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card cursor="pointer" @click.stop="openJoin">
          <v-card-title class="headline mb-3">Csatlakozás</v-card-title>
          <v-card-subtitle>
            Csatlakozás már meglévő játékhoz azonosító alapján.
            <br />dummy
          </v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn text>tovább</v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="joinDialog.open" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Csatlakozás</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :disabled="!user.isAnonymous"
                      v-model="joinDialog.user.displayName"
                      label="Játékos neve"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="joinDialog.gameId"
                      v-mask="customMask"
                      solo-inverted
                      label="Játék azonosítója"
                    ></v-text-field>
                  </v-col>
                  <!--<v-col cols="12">
                    <v-text-field
                      label="Jelszó"
                      :append-icon="hostDialog.showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="hostDialog.showPwd ? 'text' : 'password'"
                      hint="A játékot jelszóval védheted."
                      persistent-hint
                      v-model="hostDialog.password"
                      @click:append="hostDialog.showPwd = !hostDialog.showPwd"
                    ></v-text-field>
                  </v-col>-->
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="joinDialog.open = false">Mégse</v-btn>
              <v-btn
                color="info"
                text
                :loading="joinDialog.loading"
                :disabled="!validJoin || joinDialog.loading"
                @click="join"
              >Indítás</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mask } from "vue-the-mask";
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const base36 = require("base36");
const md5 = require("md5");
export default {
  name: "Home",
  props: ["user"],
  directives: { mask },
  data: () => ({
    hostDialog: {
      open: false,
      numberOfPlayers: 10,
      numberOfSpies: 2,
      password: null,
      showPwd: false,
      loading: false
    },
    joinDialog: {
      open: false,
      user: {}
    },
    customMask: {
      mask: 'CCCC CCCC',
      tokens: {
        'C': {
          pattern: /[0-9a-zA-Z]/,
          transform: v => v.toLocaleUpperCase()
        }
      }
    }
  }),
  computed: {
    validJoin() {
      if(!this.joinDialog.user.displayName || this.joinDialog.user.displayName == "" || this.joinDialog.user.displayName.length < 3)
        return false
      if(!this.joinDialog.gameId.match(/[0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z]( )[0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z][0-9a-zA-Z]/))
        return false
      return true
    }
  },
  methods: {
    async generateHost() {
      try {
        this.hostDialog.loading = true;
        const db = firebase.firestore();
        do {
          var id = base36.base36encode(new Date().getTime());
          var docRef = await db.collection("games").doc(id);
          var doc = await docRef.get();
        } while (doc.exists);
        await docRef.set({
          hostUser: {
            uid: this.user.uid,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL
          },
          options: {
            numberOfPlayers: this.hostDialog.numberOfPlayers,
            numberOfSpies: this.hostDialog.numberOfSpies,
            password:
              this.hostDialog.password && this.hostDialog.password != ""
                ? md5(this.hostDialog.password)
                : null
          },
          players: []
        });
        this.$router.replace("/host/" + docRef.id);
      } catch (error) {
        console.error(error);
      } finally {
        this.hostDialog.loading = false;
      }
    },
    openJoin() {
      this.joinDialog = {
        open: true,
        gameId: "",
        valid: false,
        user: {
          uid: this.user.uid,
          displayName: this.user.displayName,
          email: this.user.email
        }
      };
    },
    join() {
      console.log(this.joinDialog.gameId)
      this.$router.push('/join/'+this.joinDialog.gameId.toLocaleLowerCase().replace(/\s/g, ''))
    }
  }
};
</script>