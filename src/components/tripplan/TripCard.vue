<template>
  <div class="trip-container">
    <!-- 悬浮侧边栏 -->
    <div class="trip-sidebar" :class="{ 'sidebar-expanded': isSidebarExpanded }">
      <div class="sidebar-toggle" @click="toggleSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" v-if="isSidebarExpanded"></polyline>
          <polyline points="9 18 15 12 9 6" v-else></polyline>
        </svg>
      </div>

      <div class="sidebar-content">
        <div
          class="sidebar-item"
          :class="{ active: tripStore.tripType === 'recommended' }"
          @click="tripStore.switchTripType('recommended')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span>推荐行程</span>
        </div>
        <div
          class="sidebar-item"
          :class="{ active: tripStore.tripType === 'my' }"
          @click="tripStore.switchTripType('my')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>我的行程</span>
        </div>
      </div>
    </div>

    <!-- 原有的行程卡片网格 -->
    <div class="destination-grid">
      <div
        v-for="destination in tripStore.currentTrips"
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
  </div>
</template>

<script setup lang="ts">
import { useTripStore } from '../../stores/tripStore'
import { ref } from 'vue'

// 使用trip store
const tripStore = useTripStore()

// 侧边栏展开状态
const isSidebarExpanded = ref(false)

// 切换侧边栏展开状态
const toggleSidebar = () => {
  isSidebarExpanded.value = !isSidebarExpanded.value
}

// 处理行程点击
const handleTripClick = (tripId: number) => {
  tripStore.selectTrip(tripId)
}
</script>

<style scoped>
.trip-container {
  display: flex;
  height: 100%;
  position: relative;
}

.trip-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: var(--card-bg);
  border-radius: 0 12px 12px 0;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: row;
  z-index: 100;
  transition: transform 0.3s ease;
  transform: translateX(-120px);
}

.sidebar-expanded {
  transform: translateX(0);
}

.sidebar-toggle {
  width: 30px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 0 8px 8px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.sidebar-toggle:hover {
  background: var(--secondary-color);
}

.sidebar-content {
  width: 120px;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  justify-content: center;
  height: 100%;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-color);
}

.sidebar-item:hover {
  background: var(--hover-bg);
}

.sidebar-item.active {
  background: var(--primary-color);
  color: white;
}

.sidebar-item svg {
  opacity: 0.8;
}

.sidebar-item span {
  font-size: 0.9rem;
  font-weight: 500;
}

.destination-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
  flex: 1;
  overflow-y: auto;
  width: 100%;
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
  padding-top: 56.25%; /* 16:9 宽高比 */
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

@media (max-width: 768px) {
  .trip-sidebar {
    top: 0;
    height: auto;
    width: 100%;
    transform: translateY(-100%);
    border-radius: 0 0 12px 12px;
  }

  .sidebar-expanded {
    transform: translateY(0);
  }

  .sidebar-toggle {
    right: 50%;
    top: auto;
    bottom: -30px;
    transform: translateX(50%) rotate(90deg);
    border-radius: 0 0 8px 8px;
  }

  .sidebar-content {
    width: 100%;
    flex-direction: row;
    padding: 0.5rem;
  }

  .sidebar-item {
    flex: 1;
    justify-content: center;
  }
}
</style>
