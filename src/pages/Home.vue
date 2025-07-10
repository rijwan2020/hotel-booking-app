<template>
  <room-search v-if="currentPage === 'search'" @search="handleRoomSearch" />
  <room-selection
    v-else-if="currentPage === 'room'"
    :search-params="searchParams"
    :rooms="rooms"
    @select-room="handleRoomSelection"
    @back="currentPage = 'search'"
  />
</template>

<script setup>
import { ref } from "vue";
import RoomSearch from "../components/RoomSearch.vue";
import RoomSelection from "../components/RoomSelection.vue";

const currentPage = ref("search");
const searchParams = ref({});
const selectedRoom = ref(null);

const handleRoomSearch = (data) => {
  searchParams.value = data.searchParams;
  currentPage.value = "room";
};

const handleRoomSelection = (room) => {
  console.log("🚀 ~ handleRoomSelection ~ room:", room);
  selectedRoom.value = room;
  // currentPage.value = 'contact'
};

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
</script>
