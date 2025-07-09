<template>
  <div>
    <Header />
    <div class="page">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
