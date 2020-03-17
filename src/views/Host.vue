<template>
  <v-container>
  </v-container>
</template>

<script>
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
export default {
  name: "Host",
  data: () => ({}),
  mounted() {
    console.log("params",this.$route.params)
  },
  methods: {}
};
</script>