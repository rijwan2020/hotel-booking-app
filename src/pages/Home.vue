<template>
  <room-search v-if="currentPage === 'search'" @search="handleRoomSearch" />
  <room-selection
    v-else-if="currentPage === 'room'"
    :search-params="searchParams"
    :rooms="rooms"
    @select-room="handleRoomSelection"
    @back="currentPage = 'search'"
  />
  <contact-form
    v-if="currentPage === 'contact'"
    :selected-room="selectedRoom"
    :search-params="searchParams"
    :current-user="currentUser"
    @proceed="handleBookingSubmit"
    @back="currentPage = 'room'"
  />
  <confirmation
      v-if="currentPage === 'confirmation'"
      :booking="currentBooking"
      @go-to-dashboard="currentPage = 'dashboard'"
    />
</template>

<script setup>
import { ref } from "vue";
import RoomSearch from "../components/RoomSearch.vue";
import RoomSelection from "../components/RoomSelection.vue";
import ContactForm from "../components/ContactForm.vue";
import Confirmation from "../components/Confirmation.vue";

// Sample rooms data
const rooms = ref([
  {
    id: 1,
    name: "ROOM 1 TITLE",
    subtitle: "LOREM IPSUM DOLOR SIT AMET",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac tellus.",
    price: 1080,
    image_url:
      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    max_guests: 2,
  },
  {
    id: 2,
    name: "ROOM 2 TITLE",
    subtitle: "LOREM IPSUM DOLOR SIT AMET",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac tellus.",
    price: 1280,
    image_url:
      "https://plus.unsplash.com/premium_photo-1661929519129-7a76946c1d38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    max_guests: 4,
  },
  {
    id: 3,
    name: "ROOM 3 TITLE",
    subtitle: "LOREM IPSUM DOLOR SIT AMET",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac tellus.",
    price: 999,
    image_url:
      "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    max_guests: 3,
  },
]);

const currentPage = ref('search')
const currentUser = ref(null)
const isLoading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const selectedRoom = ref(null)
const searchParams = ref({})
const currentBooking = ref(null)

const handleRoomSearch = (data) => {
  searchParams.value = data.searchParams;
  currentPage.value = "room";
};

const handleRoomSelection = (room) => {
  selectedRoom.value = room;
  currentPage.value = 'contact'
};

const handleBookingSubmit = (booking) => {
  booking.room = rooms.value.find(
    (room) => room.id === booking.roomId
  );
  booking.confirmation_number = "RES" + Date.now().toString().slice(-8)
  currentBooking.value = booking
  currentPage.value = 'confirmation'
}

</script>
