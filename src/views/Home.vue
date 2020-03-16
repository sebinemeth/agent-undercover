<template>
  <v-container>
    <div class="o-headline info--text">Agent Undercover</div>
    <div class="subtitle-1 mb-3">Tégla a sorainkban!</div>
    <v-alert border="left" color="info" colored-border dense dismissible>
      <v-row align="center">
        <v-col class="grow">Nem játszottál még? Olvasd el az útmutatót!</v-col>
        <v-col class="shrink">
          <v-btn text @click="$router.replace('help')">mutasd</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <v-row>
      <v-col xs="12" sm="12" md="12" lg="6" v-if="user && !user.isAnonymous">
        <v-card cursor="pointer" @click="$router.replace('host')">
          <v-card-title class="headline mb-3">Új játék</v-card-title>
          <v-card-subtitle>Te leszel a játékvezető, de neked is lehetőséged lesz játszani. A játékbeállítások megadása után a létrejött játék azonosítóját neked kell megosztanod a többiekkel, hogy csatlakozhassanak.</v-card-subtitle>
          <v-card-actions>
            <v-spacer />
            <v-btn text>tovább</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col xs="12" sm="12" md="12" lg="6">
        <v-card cursor="pointer" @click="()=>{}">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  props: ["user"],
  data: () => ({}),
  methods: {}
};
</script>