<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">Hotel Booking</h1>
      <nav class="nav">
        <button class="nav-btn" v-if="!user">Login</button>
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
