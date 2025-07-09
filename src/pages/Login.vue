<template>
  <section class="auth-page">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <router-link to="/register">Don't have an account? Register</router-link>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveToken } from '../utils/auth'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })

  if (res.ok) {
    const data = await res.json()
    saveToken(data.token)
    router.push('/dashboard')
  } else {
    alert('Login failed')
  }
}
</script>
