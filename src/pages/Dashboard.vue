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
  const user = localStorage.getItem('user');
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
    }\nTotal: S$${
      booking.totalAmount
    }\nStatus: ${booking.status.toUpperCase()}`
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
  loadBookings()
});
</script>

<style scoped>
.page {
  min-height: calc(100vh - 80px);
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #31333a;
}

.section-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 2px solid #ededf1;
  padding-bottom: 16px;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #3c6e71;
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #f6f7f8;
  color: #31333a;
}

.no-bookings {
  text-align: center;
  padding: 64px 32px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #31333a;
  margin-bottom: 16px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 32px;
  font-size: 16px;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.booking-card {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #ededf1;
  transition: all 0.2s ease;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.booking-image {
  flex: 0 0 250px;
}

.booking-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 250px;
  background: #f6f7f8;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.booking-info {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.booking-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #31333a;
  margin-bottom: 6px;
}

.booking-details {
  flex: 1;
}

.booking-details p {
  font-size: 14px;
  color: #6b7280;
}

.status {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 12px;
  width: fit-content;
}

.status.confirmed {
  background: rgba(60, 110, 113, 0.1);
  color: #3c6e71;
}

.status.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status.completed {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.booking-actions {
  flex: 0 0 200px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.btn {
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: center;
}

.btn-primary {
  background: #3c6e71;
  color: white;
}

.btn-primary:hover {
  background: #2a5154;
  transform: translateY(-1px);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #3c6e71;
  border: 1px solid #3c6e71;
}

.btn-secondary:hover {
  background: #3c6e71;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .section-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }

  .booking-card {
    flex-direction: column;
  }

  .booking-image {
    flex: none;
  }

  .booking-actions {
    flex: none;
    flex-direction: row;
    padding: 16px 24px;
  }
}
</style>
