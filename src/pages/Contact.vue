<template>
  <section class="contact-page">
    <!-- Step Progress -->
    <div class="step-progress">
      <span class="step active">1 Search</span>
      <span class="step active">2 Select Room</span>
      <span class="step active">3 Contact Information</span>
      <span class="step">4 Confirmation</span>
    </div>

    <div class="form-summary-wrapper">
      <!-- Contact Form -->
      <form class="contact-form" @submit.prevent="handleProceed">
        <h2>Contact Information</h2>

        <label for="title">Title</label>
        <select id="title" v-model="title" required>
          <option value="Mr.">Mr.</option>
          <option value="Ms.">Ms.</option>
          <option value="Mrs.">Mrs.</option>
        </select>

        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" required />

        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required />

        <button type="submit">Proceed</button>
      </form>

      <!-- Booking Summary -->
      <div class="summary-box" v-if="room">
        <div class="summary-title">
          <h3>Booking Summary</h3>
        </div>

        <div class="room-info">
          <p><strong>{{ formattedCheckIn }}</strong> → <strong>{{ formattedCheckOut }}</strong></p>
          <p>{{ nights }} night(s) | {{ guests }} guest(s)</p>

          <img :src="room.image" alt="Room image" />

          <h4>{{ room.title }}</h4>
          <p>Price: S${{ room.price }} / night</p>

          <p>Tax & Service (9%): S${{ tax }}</p>
          <p><strong>Total: S${{ total }}</strong></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const roomId = route.query.roomId
const checkInDate = route.query.date
const guests = Number(route.query.guests || 1);

const room = ref<any>(null)
const loading = ref(true)

const nights = 1
const taxRate = 0.09

// Form state
const title = ref('Mr.')
const name = ref('')
const email = ref('')

// Fetch room detail
onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/rooms/${roomId}`)
    room.value = await res.json()
  } catch (err) {
    console.error('Error fetching room:', err)
  } finally {
    loading.value = false
  }
})

const formattedCheckIn = new Date(checkInDate).toDateString()
const formattedCheckOut = new Date(new Date(checkInDate).getTime() + nights * 86400000).toDateString()

const tax = computed(() => room.value ? (room.value.price * taxRate).toFixed(2) : '0')
const total = computed(() => room.value ? (room.value.price + parseFloat(tax.value)).toFixed(2) : '0')

// Submit booking
const handleProceed = async () => {
  const bookingData = {
    roomId,
    name: name.value,
    email: email.value,
    title: title.value,
    checkIn: checkInDate,
    nights,
    guests,
    total: total.value,
  }

  try {
    const res = await fetch('http://localhost:3000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    })
    const saved = await res.json()

    router.push({
      path: '/confirm',
      query: {
        name: name.value,
        email: email.value,
        roomTitle: room.value.title,
        checkIn: checkInDate,
        total: total.value,
        bookingRef: saved.bookingRef || 'ABC123456',
      },
    })
  } catch (error) {
    console.error('Booking failed:', error)
  }
}
</script>

<style scoped>
.contact-page {
  padding: 2rem;
}

.step-progress {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
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

.form-summary-wrapper {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-form {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-form input,
.contact-form select {
  padding: 0.5rem;
  font-size: 1rem;
}

.contact-form button {
  background: black;
  color: white;
  padding: 0.6rem;
  border: none;
  cursor: pointer;
}

.summary-box {
  flex: 1;
  min-width: 300px;
  background: #f9f9f9;
  padding: 1rem;
  border: 1px solid #ddd;
}

.summary-box img {
  width: 100%;
  max-width: 340px;
  height: auto;
  margin: 0.5rem 0;
}
</style>
