<template>
  <div class="page">
    <div class="container">
      <div class="dashboard-header">
        <h1>Dashboard - Your Bookings</h1>
        <button @click="$emit('go-to-search')" class="btn btn-primary">
          + New Booking
        </button>
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
          <div v-for="booking in filteredBookings" :key="booking.id" class="booking-card">
            <div class="booking-image">
              <img
                v-if="booking.image_url"
                :src="booking.image_url"
                :alt="booking.room_name"
                @error="handleImageError"
              >
              <div v-else class="placeholder-image">Room Image</div>
            </div>

            <div class="booking-info">
              <h3>{{ booking.room_name }}</h3>
              <div class="booking-details">
                <p><strong>Dates:</strong> {{ formatDate(booking.check_in_date) }} - {{ formatDate(booking.check_out_date) }}</p>
                <p><strong>Guests:</strong> {{ booking.guests }}</p>
                <p><strong>Total:</strong> S${{ booking.total_amount }}</p>
                <p><strong>Confirmation:</strong> {{ booking.confirmation_number }}</p>
                <p v-if="booking.special_requests"><strong>Special Requests:</strong> {{ booking.special_requests }}</p>
              </div>
              <span :class="['status', booking.status]">{{ booking.status.toUpperCase() }}</span>
            </div>

            <div class="booking-actions">
              <button
                v-if="booking.status === 'confirmed' && isUpcoming(booking)"
                @click="cancelBooking(booking.id)"
                class="btn btn-danger"
                :disabled="loading"
              >
                {{ loading ? 'Cancelling...' : 'Cancel Booking' }}
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
import { ref, computed, onMounted } from 'vue'
// import { bookingService } from '../services/api'

const props = defineProps({
  currentUser: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['go-to-search', 'loading', 'error', 'success'])

const activeTab = ref('all')
const bookings = ref([])
const loading = ref(false)

const upcomingBookings = computed(() => {
  const today = new Date()
  return bookings.value.filter(booking =>
    booking.status === 'confirmed' && new Date(booking.check_in_date) >= today
  )
})

const pastBookings = computed(() => {
  const today = new Date()
  return bookings.value.filter(booking =>
    booking.status === 'completed' || new Date(booking.check_out_date) < today
  )
})

const filteredBookings = computed(() => {
  switch (activeTab.value) {
    case 'upcoming':
      return upcomingBookings.value
    case 'past':
      return pastBookings.value
    default:
      return bookings.value
  }
})

const loadBookings = async () => {
  loading.value = true
  emit('loading', true)

  try {
    const response = await bookingService.getUserBookings()
    bookings.value = response.data
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to load bookings'
    emit('error', message)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return
  }

  loading.value = true
  emit('loading', true)

  try {
    await bookingService.cancelBooking(bookingId)

    // Update local booking status
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.status = 'cancelled'
    }

    emit('success', 'Booking cancelled successfully')
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to cancel booking'
    emit('error', message)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const viewBookingDetails = (booking) => {
  // Could open a modal or navigate to detailed view
  alert(`Booking Details:\n\nRoom: ${booking.room_name}\nDates: ${formatDate(booking.check_in_date)} - ${formatDate(booking.check_out_date)}\nGuests: ${booking.guests}\nTotal: S$${booking.total_amount}\nStatus: ${booking.status.toUpperCase()}`)
}

const isUpcoming = (booking) => {
  const today = new Date()
  return new Date(booking.check_in_date) >= today
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getEmptyMessage = () => {
  switch (activeTab.value) {
    case 'upcoming':
      return 'You have no upcoming bookings.'
    case 'past':
      return 'You have no past bookings.'
    default:
      return 'Start planning your next getaway!'
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.nextElementSibling.style.display = 'flex'
}

onMounted(() => {
  // loadBookings()
})
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
  color: #31333A;
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
  background: #3C6E71;
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #f6f7f8;
  color: #31333A;
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
  color: #31333A;
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
  flex: 0 0 200px;
}

.booking-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 160px;
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
  color: #31333A;
  margin-bottom: 16px;
}

.booking-details {
  flex: 1;
}

.booking-details p {
  margin-bottom: 8px;
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
}

.status.confirmed {
  background: rgba(60, 110, 113, 0.1);
  color: #3C6E71;
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
  flex: 0 0 160px;
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
  background: #3C6E71;
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
  color: #3C6E71;
  border: 1px solid #3C6E71;
}

.btn-secondary:hover {
  background: #3C6E71;
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
