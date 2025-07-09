<template>
  <section class="rooms-page">
    <!-- Step Progress -->
    <div class="step-progress">
      <span class="step active">1 Search</span>
      <span class="step active">2 Select Room</span>
      <span class="step">3 Contact Information</span>
      <span class="step">4 Confirmation</span>
    </div>

    <!-- Date Info -->
    <div class="date-info">
      <strong>{{ formattedCheckIn }}</strong> → <strong>{{ formattedCheckOut }}</strong>
      <span>{{ nights }} Night{{ nights > 1 ? 's' : '' }} | {{ guestCount }} Guest{{ guestCount > 1 ? 's' : '' }}</span>
    </div>

    <!-- Sort Dropdown -->
    <div class="sort-bar">
      <label for="sort">Sort By:</label>
      <select v-model="sortBy" id="sort">
        <option value="lowest">Lowest Price</option>
        <option value="highest">Highest Price</option>
      </select>
    </div>

    <!-- Room List -->
    <div v-if="loading">Loading rooms...</div>
    <div v-else-if="rooms.length === 0">No rooms available.</div>
    <div v-else class="room-list">
      <div v-for="room in sortedRooms" :key="room.id" class="room-card">
        <img :src="room.image" alt="Room Image" />
        <div class="room-details">
          <h3>{{ room.title }}</h3>
          <p>{{ room.description }}</p>
          <div class="room-price">
            <strong>S${{ room.price }}</strong><span>/night</span>
            <small>Subject to GST and charges</small>
          </div>
          <button @click="goToContact(room)">Book Room</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Router
const route = useRoute()
const router = useRouter()

// State
const rooms = ref<any[]>([])
const loading = ref(true)
const guestCount = ref(Number(route.query.guests || 1))
const checkIn = ref(route.query.date || new Date().toISOString().substring(0, 10))
const nights = ref(1) // You can make this dynamic if check-out is selected
const sortBy = ref('lowest')

// Fetch Rooms
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/rooms?guests=${guestCount.value}&date=${checkIn.value}`)
    rooms.value = await res.json()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Computed
const sortedRooms = computed(() => {
  return [...rooms.value].sort((a, b) =>
    sortBy.value === 'lowest' ? a.price - b.price : b.price - a.price
  )
})

const formattedCheckIn = computed(() => new Date(checkIn.value).toDateString())
const formattedCheckOut = computed(() => {
  const date = new Date(checkIn.value)
  date.setDate(date.getDate() + nights.value)
  return date.toDateString()
})

// Navigation
const goToContact = (room: any) => {
  router.push({
    path: '/contact',
    query: {
      roomId: room.id,
      guests: guestCount.value,
      date: checkIn.value,
    },
  })
}
</script>

<style scoped>
.rooms-page {
  padding: 2rem;
}

.step-progress {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.step {
  padding: 0.5rem 1rem;
  background: #eee;
  border-radius: 5px;
}
.step.active {
  background: black;
  color: white;
}

.date-info {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.sort-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.room-card {
  display: flex;
  border: 1px solid #ddd;
  padding: 1rem;
  gap: 1rem;
}
.room-card img {
  width: 200px;
  height: 130px;
  object-fit: cover;
}
.room-details {
  flex: 1;
}
.room-price {
  margin: 0.5rem 0;
}
button {
  background: black;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
}
</style>
