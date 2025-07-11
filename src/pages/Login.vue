<template>
  <div class="container">
    <div class="auth-container">
      <div class="auth-tabs">
        <button
          @click="authMode = 'login'"
          :class="{ active: authMode === 'login' }"
          class="tab-btn"
        >
          Login
        </button>
        <button
          @click="authMode = 'register'"
          :class="{ active: authMode === 'register' }"
          class="tab-btn"
        >
          Register
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <h2>{{ authMode === "login" ? "Login" : "Create Account" }}</h2>

        <div v-if="authMode === 'register'" class="form-group">
          <label>Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{
            loading
              ? "Processing..."
              : authMode === "login"
              ? "Login"
              : "Register"
          }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import router from "../router";
import { login, register } from "../utils/auth";

const authMode = ref("login");
const loading = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  let user = null;
  loading.value = true;
  try {
    if (authMode.value === 'login') {
      const payloads = {
        email: form.email,
        password: form.password
      }
      user = await login(payloads);
    } else {
      const payloads = {
        id: Date.now().toString().slice(-8), // Unique ID based on timestamp
        name: form.name,
        email: form.email,
        password: form.password
      }
      user = await register(payloads);
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
    alert(error);
    return;
  }
  if (user) {
    window.location.href = "/dashboard";
  }

};

onMounted(() => {
  const user = localStorage.getItem("user");
  if (user) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>

.tab-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  color: #31333a;
}

.tab-btn.active {
  background: white;
  color: #3c6e71;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 24px;
}

.btn {
  width: 100%;
}
</style>
