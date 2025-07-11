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

<script setup>
import { computed } from "vue";

const user = computed(() => {
  return {
    name: 'Test',
    email: 'tes@mail.com'
  }
  // const user = localStorage.getItem('user');
  // return user ? JSON.parse(user) : null;
});

</script>

<style lang="scss" scoped></style>
