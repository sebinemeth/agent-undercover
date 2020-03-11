<template>
  <div class="home">
    <button @click="sayhi">Press me</button>
  </div>
</template>

<script>
// import firebase from "firebase";
// @ is an alias to /src
export default {
  name: "home",
  methods: {
    sayhi() {
      alert("hello")
    }
  }
};
</script>