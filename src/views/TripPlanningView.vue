<template>
  <div class="trip-planning-view">
    <div class="part-1">
      <TripCard />
    </div>

    <div class="part-2">
      <TripInfo />
    </div>

    <div class="part-3">
      <GdMap />
    </div>

    <!-- 添加悬浮加号按钮 -->
    <button class="floating-add-button" @click="handleAddButtonClick">
      <span class="plus-icon">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import GdMap from '../components/GdMap.vue'
import TripCard from '../components/TripCard.vue'
import TripInfo from '../components/TripInfo.vue'
// import { useTripStore } from '../stores/tripStore'

// 使用trip store
// const tripStore = useTripStore()

// 加号按钮点击事件处理函数
const handleAddButtonClick = () => {
  console.log('加号按钮被点击')
  // 这里可以添加后续的事件处理逻辑，例如打开添加行程的表单
}
</script>

<style scoped>
.trip-planning-view {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 80px);
  margin-top: 45px;
  position: relative; /* 添加相对定位，作为悬浮按钮的参考 */
  background-color: var(--bg-color);
  color: var(--text-color);
}

.part-1 {
  width: 20%;
  margin-left: 5px;
  margin-right: 5px;
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 15px;
  box-shadow: var(--card-shadow);
  overflow-y: auto;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.part-2 {
  width: 30%;
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 15px;
  box-shadow: var(--card-shadow);
  overflow-y: auto;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.part-3 {
  width: 50%;
  margin-left: 5px;
  margin-right: 5px;
  background-color: var(--card-bg);
  border-radius: 20px;
  box-shadow: var(--card-shadow);
  overflow: hidden; /* 确保地图不会溢出容器 */
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* 悬浮加号按钮样式 */
.floating-add-button {
  position: fixed;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease;
}

.floating-add-button:hover {
  transform: translateX(-50%) scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.floating-add-button:active {
  transform: translateX(-50%) scale(0.95);
}

.plus-icon {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
