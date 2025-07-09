<template>
  <div>
    <Header />
    <!-- <router-view /> -->
  </div>
</template>

<script>
import Header from './components/Header.vue';
export default {
  name: 'App',
  components: {
    Header,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
