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

.auth-container {
  max-width: 440px;
  margin: 3rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  background: #f6f7f8;
}

.tab-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #31333a;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: white;
  color: #3c6e71;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.auth-form {
  padding: 32px;
}

.auth-form h2 {
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #31333a;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #31333a;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  padding: 14px 16px;
  border: 2px solid #ededf1;
  border-radius: 8px;
  font-size: 16px;
  color: #31333a;
  background: white;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3c6e71;
  box-shadow: 0 0 0 3px rgba(60, 110, 113, 0.1);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn {
  width: 100%;
  padding: 14px 28px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #3c6e71;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2a5154;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(60, 110, 113, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>
