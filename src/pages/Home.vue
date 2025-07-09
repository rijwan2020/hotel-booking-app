<template>
  <room-search v-if="currentPage === 'search'" @search="handleRoomSearch" />
</template>

<script setup>
import { ref } from "vue";
import RoomSearch from "../components/RoomSearch.vue";

const currentPage = ref("search");
const searchParams = ref({});

const handleRoomSearch = (data) => {
  console.log("🚀 ~ handleRoomSearch ~ data:", data);
  // rooms.value = data.rooms
  searchParams.value = data.searchParams;
  currentPage.value = "rooms";
};
</script>
