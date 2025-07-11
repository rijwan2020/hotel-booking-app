<template>
  <div class="page">
    <div class="container">
      <div class="confirmation-content">
        <div class="success-icon">🎉</div>
        <h1>YOUR BOOKING HAS BEEN CONFIRMED</h1>

        <div class="confirmation-details">
          <p>
            We have sent your booking confirmation to the email address that you
            have provided.
          </p>
          <div class="booking-info">
            <p>
              <strong>Check In/Check out:</strong>
              {{ formatDate(booking.checkInDate) }} →
              {{ formatDate(booking.checkOutDate) }}
            </p>
            <p>
              <strong>Booking Confirmation Number:</strong>
              {{ booking.confirmation_number }}
            </p>
            <p><strong>Total Price:</strong> S${{ booking.totalAmount }}</p>
          </div>
        </div>

        <div class="confirmation-layout">
          <div class="room-details-section">
            <div class="room-image">
              <img
                v-if="booking.room.image_url"
                :src="booking.room.image_url"
                :alt="booking.room.name"
              />
              <div v-else class="placeholder-image">340 × 210</div>
            </div>

            <div class="room-info">
              <h3>ROOM: {{ booking.room.name }}</h3>
              <p>
                {{ booking.guests }} Guest{{ booking.guests > 1 ? "s" : "" }}
              </p>

              <div class="package-details">
                <h4>PACKAGE DETAILS:</h4>
                <div class="price-row">
                  <span
                    >Room ({{ nights }} night{{ nights > 1 ? "s" : "" }})</span
                  >
                  <span>S${{ roomTotal.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Tax & Service Charges (9%)</span>
                  <span>S${{ taxAmount.toFixed(2) }}</span>
                </div>
                <div class="price-row total">
                  <span>Total Price</span>
                  <span>S${{ booking.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="guest-details">
            <h3>GUEST DETAILS</h3>
            <p>
              <strong>Name:</strong> {{ booking.guest_title }}
              {{ booking.guestName }}
            </p>
            <p><strong>Email Address:</strong> {{ booking.guestEmail }}</p>
            <p v-if="booking.special_requests">
              <strong>Special Requests:</strong> {{ booking.specialRequests }}
            </p>
            <div class="status-badge confirmed">CONFIRMED</div>
          </div>
        </div>

        <div class="action-buttons">
        <router-link to="/dashboard" class="btn btn-primary">Go to Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  booking: {
    type: Object,
    required: true,
  },
});

const nights = computed(() => {
  if (!props.booking.checkInDate || !props.booking.checkOutDate) return 1;
  const checkIn = new Date(props.booking.checkInDate);
  const checkOut = new Date(props.booking.checkOutDate);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

const roomTotal = computed(() => {
  return props.booking.totalAmount / 1.09;
});

const taxAmount = computed(() => {
  return roomTotal.value * 0.09;
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

const handleImageError = (event) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
};
</script>


<style scoped>
.booking-info {
  background: #f6f7f8;
  padding: 24px;
  border-radius: 12px;
  margin-top: 24px;
}
</style>