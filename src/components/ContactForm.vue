<template>
  <div class="container">
    <div class="booking-steps">
      <div class="step active">1 SEARCH</div>
      <div class="step active">2 SELECT ROOM</div>
      <div class="step active">3 CONTACT DETAILS</div>
      <div class="step">4 CONFIRMATION</div>
    </div>

    <div class="contact-layout">
      <div class="contact-form-section">
        <h2>CONTACT INFORMATION</h2>
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label>Title</label>
            <select v-model="form.title" required :disabled="loading">
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>

          <div class="form-group">
            <label>Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-group">
            <label>Special Requests (Optional)</label>
            <textarea
              v-model="form.specialRequests"
              rows="3"
              placeholder="Any special requests or preferences..."
              :disabled="loading"
            ></textarea>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="$emit('back')"
              class="btn btn-secondary"
              :disabled="loading"
            >
              ← Back
            </button>
            <button type="submit" class="btn btn-dark" :disabled="loading">
              {{ loading ? "PROCESSING..." : "PROCEED TO BOOKING" }}
            </button>
          </div>
        </form>
      </div>

      <booking-summary
        :selected-room="selectedRoom"
        :search-params="searchParams"
        :guest-info="form"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
// import { bookingService } from '../services/api'
import BookingSummary from "./BookingSummary.vue";

const props = defineProps({
  selectedRoom: {
    type: Object,
    required: true,
  },
  searchParams: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["proceed", "back"]);

const loading = ref(false);

const form = reactive({
  title: "Mr.",
  name: "",
  email: "",
  specialRequests: "",
});

const calculateTotal = () => {
  const nights = Math.ceil(
    (new Date(props.searchParams.checkOut) -
      new Date(props.searchParams.checkIn)) /
      (1000 * 60 * 60 * 24)
  );
  const baseTotal = props.selectedRoom.price * nights;
  const tax = baseTotal * 0.09;
  return Math.round((baseTotal + tax) * 100) / 100;
};

const handleSubmit = async () => {

  try {
    const bookingData = {
      roomId: props.selectedRoom.id,
      checkInDate: props.searchParams.checkIn,
      checkOutDate: props.searchParams.checkOut,
      guests: parseInt(props.searchParams.guests),
      guestTitle: form.title,
      guestName: form.name,
      guestEmail: form.email,
      totalAmount: calculateTotal(),
      specialRequests: form.specialRequests || null,
    };

    // const response = await bookingService.createBooking(bookingData)
    // emit('proceed', response.data)
    emit("proceed", bookingData);
  } catch (error) {
    console.log("Error creating booking:", error);
  }
};

onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log('🚀 ~ onMounted ~ user:', user);
  if (user) {
    form.name = user.name;
    form.email = user.email;
  }
});
</script>

<style lang="scss" scoped></style>
