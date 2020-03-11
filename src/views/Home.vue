<template>
  <div class="container">
    <h1>Home</h1>
    <ul>
      <li>
        <router-link to="/join">Join</router-link>
      </li>
      <li>
        <router-link to="/create">Create</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
