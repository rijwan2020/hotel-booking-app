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
          <button class="nav-btn" @click="goToDashboard">Dashboard</button>
          <button class="router-link-active router-link-exact-active nav-btn" @click="handleLogout">Logout</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { logout } from "../utils/auth";

const user = computed(() => {
  const userLoggedId = localStorage.getItem('user');
  return userLoggedId ? JSON.parse(userLoggedId) : null;
});

const handleLogout = () => {
  logout();
  window.location.href = "/login";
};

const goToDashboard = () => {
  window.location.href = "/dashboard";
};

</script>

<style lang="scss" scoped></style>
