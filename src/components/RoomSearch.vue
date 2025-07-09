<template>
  <div class="hero-section">
    <div class="hero-image">
      <img
        src="../assets/images/banner-3.jpg"
        alt="banner image"
        class="banner-image"
      />
    </div>
    <div class="hero-content">
      <h1>Book A Room</h1>
      <div class="search-form">
        <form @submit.prevent="handleSearch">
          <div class="form-row">
            <div class="form-group">
              <label>Guest</label>
              <select v-model="searchForm.guests" :disabled="loading">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div class="form-group">
              <label>Check-in Date</label>
              <input
                v-model="searchForm.checkIn"
                type="date"
                required
                :min="today"
                :disabled="loading"
              />
            </div>
            <div class="form-group">
              <label>Check-out Date</label>
              <input
                v-model="searchForm.checkOut"
                type="date"
                required
                :min="minCheckOut"
                :disabled="loading"
              />
            </div>
          </div>
          <button type="submit" class="btn btn-dark" :disabled="loading">
            {{ loading ? "SEARCHING..." : "SEARCH FOR ROOMS" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const emit = defineEmits(["search", "loading", "error"]);

const loading = ref(false);
const today = ref("");

const searchForm = ref({
  guests: "2",
  checkIn: "",
  checkOut: "",
});

const minCheckOut = computed(() => {
  if (!searchForm.value.checkIn) return today.value;
  const checkInDate = new Date(searchForm.value.checkIn);
  checkInDate.setDate(checkInDate.getDate() + 1);
  return checkInDate.toISOString().split("T")[0];
});

const handleSearch = async () => {
  if (!searchForm.value.checkIn || !searchForm.value.checkOut) {
    emit("error", "Please select check-in and check-out dates");
    return;
  }

  if (
    new Date(searchForm.value.checkOut) <= new Date(searchForm.value.checkIn)
  ) {
    emit("error", "Check-out date must be after check-in date");
    return;
  }

  loading.value = true;
  emit("loading", true);

  try {
    emit("search", {
      searchParams: { ...searchForm.value },
    });
  } catch (error) {
    const message = error.response?.data?.error || "Failed to search rooms";
    emit("error", message);
  } finally {
    loading.value = false;
    emit("loading", false);
  }
};

onMounted(() => {
  const todayDate = new Date();
  const tomorrow = new Date(todayDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  today.value = todayDate.toISOString().split("T")[0];
  searchForm.value.checkIn = today.value;
  searchForm.value.checkOut = tomorrow.toISOString().split("T")[0];
});
</script>
