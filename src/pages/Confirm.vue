<template>
  <section class="confirm-page">
    <!-- Step Progress -->
    <div class="step-progress">
      <span class="step active">1 Search</span>
      <span class="step active">2 Select Room</span>
      <span class="step active">3 Contact Information</span>
      <span class="step active">4 Confirmation</span>
    </div>

    <div class="confirmation-box">
      <h2>Booking Confirmed 🎉</h2>
      <p class="booking-ref">Booking Reference: <strong>{{ bookingRef }}</strong></p>

      <div class="guest-info">
        <h3>Guest Information</h3>
        <p><strong>Name:</strong> {{ name }}</p>
        <p><strong>Email:</strong> {{ email }}</p>
      </div>

      <div class="room-summary">
        <h3>Booking Summary</h3>
        <p><strong>Room:</strong> {{ roomTitle }}</p>
        <p><strong>Check-In:</strong> {{ formattedCheckIn }}</p>
        <p><strong>Check-Out:</strong> {{ formattedCheckOut }}</p>
        <p><strong>Total:</strong> S${{ total }}</p>
      </div>

      <router-link to="/" class="home-link">Back to Home</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const name = route.query.name as string
const email = route.query.email as string
const roomTitle = route.query.roomTitle as string
const checkIn = route.query.checkIn as string
const total = route.query.total as string
const bookingRef = route.query.bookingRef as string || 'ABC123456'

const nights = 1
const formattedCheckIn = new Date(checkIn).toDateString()
const formattedCheckOut = new Date(new Date(checkIn).getTime() + nights * 86400000).toDateString()
</script>

<style scoped>
.confirm-page {
  padding: 2rem;
  text-align: center;
}

.step-progress {
  display: flex;
  justify-content: center;
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

.confirmation-box {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  border-radius: 10px;
}

.booking-ref {
  font-size: 1.2rem;
  margin: 1rem 0;
}

.guest-info,
.room-summary {
  text-align: left;
  margin-top: 2rem;
}

.home-link {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.6rem 1.2rem;
  background: black;
  color: white;
  text-decoration: none;
}
</style>
