<template>
  <div class="booking-summary">
    <div class="summary-header">
      <div class="summary-dates">
        {{ formatDate(searchParams.checkIn) }} →
        {{ formatDate(searchParams.checkOut) }}
      </div>
      <div class="summary-nights">
        {{ nights }} NIGHT{{ nights > 1 ? "S" : "" }}
      </div>
      <div class="summary-room">
        ROOM: {{ searchParams.guests }} GUEST{{
          searchParams.guests > 1 ? "S" : ""
        }}
      </div>
    </div>

    <div class="room-preview">
      <img
        v-if="selectedRoom.image_url"
        :src="selectedRoom.image_url"
        :alt="selectedRoom.name"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image">340 × 210</div>
    </div>

    <div class="room-info">
      <h3 class="room-title">{{ selectedRoom.name }}</h3>
      <p class="room-subtitle">{{ selectedRoom.subtitle }}</p>

      <div class="amenities-preview" v-if="selectedRoom.amenities">
        <h4>Amenities:</h4>
        <ul>
          <li
            v-for="amenity in selectedRoom.amenities.slice(0, 4)"
            :key="amenity"
          >
            {{ amenity }}
          </li>
          <li v-if="selectedRoom.amenities.length > 4" class="more-amenities">
            +{{ selectedRoom.amenities.length - 4 }} more
          </li>
        </ul>
      </div>
    </div>

    <div class="pricing-breakdown">
      <h4>Pricing Breakdown</h4>
      <div class="price-row">
        <span>Room ({{ nights }} night{{ nights > 1 ? "s" : "" }})</span>
        <span>S${{ (selectedRoom.price * nights).toFixed(2) }}</span>
      </div>
      <div class="price-row">
        <span>Tax & Service Charges (9%)</span>
        <span>S${{ taxAmount.toFixed(2) }}</span>
      </div>
      <div class="price-row total">
        <span>TOTAL</span>
        <span>S${{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="guestInfo.name" class="guest-preview">
      <h4>Guest Information</h4>
      <p><strong>Name:</strong> {{ guestInfo.title }} {{ guestInfo.name }}</p>
      <p><strong>Email:</strong> {{ guestInfo.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  selectedRoom: {
    type: Object,
    required: true,
  },
  searchParams: {
    type: Object,
    required: true,
  },
  guestInfo: {
    type: Object,
    default: () => ({}),
  },
});

const nights = computed(() => {
  if (!props.searchParams.checkIn || !props.searchParams.checkOut) return 1;
  const checkIn = new Date(props.searchParams.checkIn);
  const checkOut = new Date(props.searchParams.checkOut);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

const taxAmount = computed(() => {
  const basePrice = props.selectedRoom.price * nights.value;
  return basePrice * 0.09;
});

const totalAmount = computed(() => {
  const basePrice = props.selectedRoom.price * nights.value;
  return basePrice + taxAmount.value;
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
