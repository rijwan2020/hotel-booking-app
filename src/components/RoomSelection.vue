<template>
  <div class="container">
    <div class="booking-steps">
      <div class="step active">1 SEARCH</div>
      <div class="step active">2 SELECT ROOM</div>
      <div class="step">3 CONTACT INFORMATION</div>
      <div class="step">4 CONFIRMATION</div>
    </div>

    <div class="booking-header">
      <div class="dates">
        {{ formatDate(searchParams.checkIn) }} →
        {{ formatDate(searchParams.checkOut) }}
      </div>
      <div class="booking-info">
        {{ nights }} NIGHT{{ nights > 1 ? "S" : "" }} |
        {{ searchParams.guests }} GUEST{{ searchParams.guests > 1 ? "S" : "" }}
      </div>
      <div class="sort-options">
        <label>SORT BY:</label>
        <select v-model="sortBy">
          <option value="price">LOWEST PRICE</option>
          <option value="name">NAME</option>
          <option value="guests">MAX GUESTS</option>
        </select>
      </div>
    </div>

    <div class="rooms-list">
      <div v-for="room in sortedRooms" :key="room.id" class="room-card">
        <div class="room-image">
          <img
            v-if="room.image_url"
            :src="room.image_url"
            :alt="room.name"
            @error="handleImageError"
          />
          <div v-else class="placeholder-image">340 × 210</div>
        </div>
        <div class="room-details">
          <h3>{{ room.name }}</h3>
          <p class="room-subtitle">{{ room.subtitle }}</p>
          <p class="room-description">{{ room.description }}</p>
          <div class="room-amenities" v-if="room.amenities">
            <span
              v-for="amenity in room.amenities.slice(0, 3)"
              :key="amenity"
              class="amenity-tag"
            >
              {{ amenity }}
            </span>
            <span v-if="room.amenities.length > 3" class="amenity-more">
              +{{ room.amenities.length - 3 }} more
            </span>
          </div>
        </div>
        <div class="room-pricing">
          <div class="price">S${{ room.price }}<span>/night</span></div>
          <div class="total-price">
            Total: S${{ calculateTotal(room.price) }}
          </div>
          <div class="tax-note">Subject to GST and charges</div>
          <div class="max-guests">Max {{ room.max_guests }} guests</div>
          <button
            @click="selectRoom(room)"
            class="btn btn-dark"
            :disabled="loading"
          >
            {{ loading ? "LOADING..." : "BOOK ROOM" }}
          </button>
        </div>
      </div>
    </div>

    <div class="back-button-container">
      <button @click="$emit('back')" class="btn btn-secondary">
        ← Back to Search
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  rooms: {
    type: Array,
    required: true,
  },
  searchParams: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select-room", "back", "loading", "error"]);

const sortBy = ref("price");
const loading = ref(false);

const nights = computed(() => {
  if (!props.searchParams.checkIn || !props.searchParams.checkOut) return 1;
  const checkIn = new Date(props.searchParams.checkIn);
  const checkOut = new Date(props.searchParams.checkOut);
  return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
});

const sortedRooms = computed(() => {
  const roomsCopy = [...props.rooms];
  switch (sortBy.value) {
    case "price":
      return roomsCopy.sort((a, b) => a.price - b.price);
    case "name":
      return roomsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case "guests":
      return roomsCopy.sort((a, b) => b.max_guests - a.max_guests);
    default:
      return roomsCopy;
  }
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

const calculateTotal = (pricePerNight) => {
  const baseTotal = pricePerNight * nights.value;
  const tax = baseTotal * 0.09;
  return Math.round((baseTotal + tax) * 100) / 100;
};

const selectRoom = (room) => {
  emit("select-room", room);
};

const handleImageError = (event) => {
  event.target.style.display = "none";
  event.target.nextElementSibling.style.display = "flex";
};
</script>
