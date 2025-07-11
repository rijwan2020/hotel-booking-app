<template>
  <div class="page">
    <div class="container">
      <div class="dashboard-header">
        <h1>Dashboard - Your Bookings</h1>
        <router-link to="/" class="btn btn-primary">
          + New Booking
        </router-link>
      </div>

      <div class="bookings-section">
        <div class="section-tabs">
          <button
            @click="activeTab = 'all'"
            :class="{ active: activeTab === 'all' }"
            class="tab-btn"
          >
            All Bookings ({{ bookings.length }})
          </button>
          <button
            @click="activeTab = 'upcoming'"
            :class="{ active: activeTab === 'upcoming' }"
            class="tab-btn"
          >
            Upcoming ({{ upcomingBookings.length }})
          </button>
          <button
            @click="activeTab = 'past'"
            :class="{ active: activeTab === 'past' }"
            class="tab-btn"
          >
            Past ({{ pastBookings.length }})
          </button>
        </div>

        <div v-if="filteredBookings.length === 0" class="no-bookings">
          <div class="empty-state">
            <div class="empty-icon">📅</div>
            <h3>No bookings found</h3>
            <p>{{ getEmptyMessage() }}</p>
            <router-link to="/" class="btn btn-primary">
              Make Your First Booking
            </router-link>
          </div>
        </div>

        <div v-else class="bookings-list">
          <div
            v-for="booking in filteredBookings"
            :key="booking.id"
            class="booking-card"
          >
            <div class="booking-image">
              <img
                v-if="booking.room.image_url"
                :src="booking.room.image_url"
                :alt="booking.room.name"
                @error="handleImageError"
              />
              <div v-else class="placeholder-image">Room Image</div>
            </div>

            <div class="booking-info">
              <h3>{{ booking.room.name }}</h3>
              <div class="booking-details">
                <p>
                  <strong>Dates:</strong>
                  {{ formatDate(booking.checkInDate) }} -
                  {{ formatDate(booking.checkOutDate) }}
                </p>
                <p><strong>Guests:</strong> {{ booking.guests }}</p>
                <p><strong>Total:</strong> S${{ booking.totalAmount }}</p>
                <p>
                  <strong>Confirmation:</strong>
                  {{ booking.confirmation_number }}
                </p>
                <p v-if="booking.specialRequests">
                  <strong>Special Requests:</strong>
                  {{ booking.specialRequests }}
                </p>
              </div>
              <span :class="['status', booking.status]">{{
                booking.status.toUpperCase()
              }}</span>
            </div>

            <div class="booking-actions">
              <button
                v-if="booking.status === 'confirmed' && isUpcoming(booking)"
                @click="handleCancelBooking(booking.id)"
                class="btn btn-danger"
                :disabled="loading"
              >
                {{ loading ? "Cancelling..." : "Cancel Booking" }}
              </button>
              <button
                @click="viewBookingDetails(booking)"
                class="btn btn-secondary"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { cancelBooking, getBookings } from "../utils/booking";

const user = computed(() => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
});

const emit = defineEmits(["go-to-search", "loading", "error", "success"]);

const activeTab = ref("all");
const bookings = ref([]);
const loading = ref(false);

const upcomingBookings = computed(() => {
  const today = new Date();
  return bookings.value.filter(
    (booking) =>
      booking.status === "confirmed" && new Date(booking.checkInDate) >= today
  );
});

const pastBookings = computed(() => {
  const today = new Date();
  return bookings.value.filter(
    (booking) =>
      booking.status === "completed" || new Date(booking.checkOutDate) < today
  );
});

const filteredBookings = computed(() => {
  switch (activeTab.value) {
    case "upcoming":
      return upcomingBookings.value;
    case "past":
      return pastBookings.value;
    default:
      return bookings.value;
  }
});

const loadBookings = async () => {
  const user_id = user.value ? user.value.id : null;
  bookings.value = await getBookings(user_id);
};

const handleCancelBooking = (bookingId) => {
  if (bookingId) {
    cancelBooking(bookingId);
  }
  loadBookings();
  return true;
};

const viewBookingDetails = (booking) => {
  // Could open a modal or navigate to detailed view
  alert(
    `Booking Details:\n\nRoom: ${booking.room.name}\nDates: ${formatDate(
      booking.checkInDate
    )} - ${formatDate(booking.checkOutDate)}\nGuests: ${
      booking.guests
    }\nTotal: S$${booking.totalAmount}\nStatus: ${booking.status.toUpperCase()}`
  );
};

const isUpcoming = (booking) => {
  const today = new Date();
  return new Date(booking.checkInDate) >= today;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getEmptyMessage = () => {
  switch (activeTab.value) {
    case "upcoming":
      return "You have no upcoming bookings.";
    case "past":
      return "You have no past bookings.";
    default:
      return "Start planning your next getaway!";
  }
};

const handleImageError = (event) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
};

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>

.booking-info {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}



.btn {
  padding: 10px 16px;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 6px;
  text-align: center;
}
</style>
