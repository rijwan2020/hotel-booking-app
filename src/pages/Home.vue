<template>
  <div class="hero-section">
    <div class="hero-image">
      <img src="../assets/images/banner-3.jpg" alt="banner image" class="banner-image">
    </div>
    <div class="hero-content">
      <h1>Book A Room</h1>
      <div class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label>Guest</label>
            <select>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div class="form-group">
            <label>Check-in Date</label>
            <input type="date" required>
          </div>
          <div class="form-group">
            <label>Check-out Date</label>
            <input type="date" required>
          </div>
        </div>
        <button class="btn btn-dark">Search For Room</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup () {


    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>