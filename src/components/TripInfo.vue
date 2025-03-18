<template>
  <div class="trip-info">
    <div v-if="tripStore.selectedTrip" class="trip-details">
      <h2 class="trip-title">{{ tripStore.selectedTrip.title }}</h2>
      
      <div class="trip-overview">
        <div class="trip-meta-large">
          <div class="meta-item">
            <span class="meta-label">行程天数</span>
            <span class="meta-value">{{ tripStore.selectedTrip.duration }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">景点数量</span>
            <span class="meta-value">{{ tripStore.selectedTrip.spots }}个地点</span>
          </div>
        </div>
        
        <div class="trip-description">
          <p>{{ tripStore.selectedTrip.alt || '暂无描述' }}</p>
        </div>
      </div>
      
      <!-- 如果有详细行程信息，则显示 -->
      <div v-if="tripStore.selectedTrip.details" class="daily-itinerary">
        <h3>行程安排</h3>
        
        <div v-for="(day, dayIndex) in tripStore.selectedTrip.details.address" :key="dayIndex" class="day-plan">
          <h4>第{{ dayIndex + 1 }}天</h4>
          
          <div class="spots-list">
            <div v-for="spot in day" :key="spot.id" class="spot-item">
              <div class="spot-header">
                <h5>{{ spot.name || '景点' + spot.id }}</h5>
                <div class="spot-time">{{ spot.time }}</div>
              </div>
              
              <div class="spot-content">
                <div class="spot-image" v-if="spot.img">
                  <img :src="spot.img" alt="景点图片" />
                </div>
                <div class="spot-desc">
                  <p>{{ spot.desc }}</p>
                  <div class="spot-price">价格: {{ spot.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-trip-selected">
      <p>请从左侧选择一个行程查看详情</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTripStore } from '../stores/tripStore'

// 使用trip store
const tripStore = useTripStore()
</script>

<style scoped>
.trip-info {
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trip-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.trip-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trip-meta-large {
  display: flex;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.meta-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-color);
}

.trip-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-color);
}

.daily-itinerary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.daily-itinerary h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.day-plan {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.day-plan h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.spots-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.spot-item {
  padding: 1rem;
  background: var(--bg-color);
  border-radius: 8px;
  border-left: 3px solid var(--secondary-color);
}

.spot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.spot-header h5 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.spot-time {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

.spot-content {
  display: flex;
  gap: 1rem;
}

.spot-image {
  flex: 0 0 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
}

.spot-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot-desc {
  flex: 1;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-color);
}

.spot-price {
  margin-top: 0.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.no-trip-selected {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 1.1rem;
}
</style>
