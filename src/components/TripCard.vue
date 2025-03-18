<template>
  <div class="destination-grid">
    <div
      v-for="destination in tripStore.destinations"
      :key="destination.id"
      class="destination-card"
      @click="handleTripClick(destination.id)"
    >
      <div class="destination-image">
        <img :src="destination.image" :alt="destination.alt" />
      </div>
      <div class="destination-info">
        <h4>{{ destination.title }}</h4>
        <div class="trip-meta">
          <span class="duration">{{ destination.duration }}</span>
          <span class="divider">|</span>
          <span class="spots">{{ destination.spots }}个地点</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTripStore } from '../stores/tripStore'

// 使用trip store
const tripStore = useTripStore()

// 处理行程点击
const handleTripClick = (tripId: number) => {
  tripStore.selectTrip(tripId)
}
</script>

<style scoped>
.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.destination-card {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 250px;
}

.destination-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.destination-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 3:2 宽高比 */
  overflow: hidden;
}

.destination-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.destination-card:hover .destination-image img {
  transform: scale(1.05);
}

.destination-info {
  padding: 1rem;
  background: var(--card-bg);
}

.destination-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
}

.trip-meta {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.trip-meta .divider {
  margin: 0 0.5rem;
  color: var(--border-color);
}
</style>
