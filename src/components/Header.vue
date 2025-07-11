<template>
  <header class="header">
    <div class="container">
      <router-link to="/" class="logo">
        Hotel Booking
      </router-link>
      <nav class="nav">
        <router-link class="nav-btn" v-if="!user" to="/login">Login</router-link>
        <div class="user-menu" v-else>
          <span>Welcome, {{ user.name }}</span>
          <button class="nav-btn">Dashboard</button>
          <button class="nav-btn">Logout</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Headers",
  // define props
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
