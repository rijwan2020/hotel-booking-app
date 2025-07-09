<template>
  <section class="auth-page">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <router-link to="/login">Already have an account? Login</router-link>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveToken } from '../utils/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  const res = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
  })

  if (res.ok) {
    const data = await res.json()
    saveToken(data.token)
    router.push('/dashboard')
  } else {
    alert('Registration failed')
  }
}
</script>
