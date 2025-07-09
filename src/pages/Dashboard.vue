<template>
  <section class="dashboard-page">
    <h2>Welcome, {{ user?.name }}</h2>

    <div v-if="loading">Loading your bookings...</div>
    <div v-else-if="bookings.length === 0">No bookings found.</div>
    <ul v-else class="booking-list">
      <li v-for="b in bookings" :key="b.id" class="booking-item">
        <div>
          <strong>{{ b.room.title }}</strong
          ><br />
          {{ formatDate(b.checkIn) }} - {{ formatDate(b.checkOut) }}<br />
          Total: S${{ b.total }}
        </div>

        <button class="cancel-btn" @click="cancelBooking(b.id)">Cancel</button>
      </li>
    </ul>

    <button @click="logout">Logout</button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getToken, authHeader, removeToken } from "../utils/auth";

const router = useRouter();
const user = ref<any>(null);
const bookings = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (!getToken()) {
    router.push("/login");
    return;
  }

  try {
    const userRes = await fetch("http://localhost:3000/me", {
      headers: authHeader(),
    });
    const bookingRes = await fetch("http://localhost:3000/bookings", {
      headers: authHeader(),
    });

    if (!userRes.ok || !bookingRes.ok) throw new Error("Unauthorized");

    user.value = await userRes.json();
    bookings.value = await bookingRes.json();
  } catch (e) {
    removeToken();
    router.push("/login");
  } finally {
    loading.value = false;
  }
});

const logout = () => {
  removeToken();
  router.push("/login");
};

const formatDate = (d: string) => new Date(d).toDateString();

const cancelBooking = async (id: number) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    const res = await fetch(`http://localhost:3000/bookings/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    })

    if (!res.ok) {
      throw new Error('Failed to cancel booking')
    }

    // Refresh booking list
    bookings.value = bookings.value.filter(b => b.id !== id)
    alert('Booking cancelled successfully.')
  } catch (error) {
    console.error(error)
    alert('Failed to cancel booking.')
  }
}
</script>

<style scoped>
.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.cancel-btn {
  background: crimson;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  border-radius: 4px;
}

</style>