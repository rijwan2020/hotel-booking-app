<template>
    <div class="fade-enter fade-enter-active">

        <section class="hero">
          <div class="banner">
            <h1>BOOK A ROOM</h1>
            <form class="search-form" @submit.prevent="handleSearch">
              <select v-model="guestCount">
                <option v-for="n in 10" :key="n" :value="n">{{ n }} Guest{{ n > 1 ? 's' : '' }}</option>
              </select>

              <input type="date" v-model="checkInDate" required />

              <button type="submit">Search for Rooms</button>
            </form>
          </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const guestCount = ref(1)
const checkInDate = ref('')
const router = useRouter()

const handleSearch = () => {
  const params = new URLSearchParams({
    guests: guestCount.value.toString(),
    date: checkInDate.value,
  }).toString()

  router.push(`/rooms?${params}`)
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem;
}
.banner {
  margin: auto;
  max-width: 600px;
}
.search-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}
.search-form select,
.search-form input,
.search-form button {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
