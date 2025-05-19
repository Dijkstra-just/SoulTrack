<template>
  <div class="trip-planning-view bg-base-100">
    <div class="part-1 card shadow-lg">
      <TripCard />
    </div>

    <div class="part-2 card shadow-lg">
      <TripInfo />
    </div>

    <div class="part-3 card shadow-lg">
      <GdMap />
    </div>

    <!-- 添加悬浮加号按钮 -->
    <button class="btn btn-circle btn-primary floating-add-button" @click="handleAddButtonClick">
      <span class="text-2xl font-bold">+</span>
    </button>
    <coze />

    <!-- 添加行程模态框 -->
    <AddTripModal
      :show="showAddTripModal"
      @close="showAddTripModal = false"
      @tripAdded="handleTripAdded"
    />
  </div>
</template>

<script setup lang="ts">
import GdMap from '../components/tripplan/GdMap.vue'
import TripCard from '../components/tripplan/TripCard.vue'
import TripInfo from '../components/tripplan/TripInfo.vue'
import coze from '../components/ai/coze.vue'
import AddTripModal from '../components/tripplan/AddTripModal.vue'
import { ref } from 'vue'
import { useTripStore } from '../stores/tripStore'

// 使用trip store
const tripStore = useTripStore()

// 添加行程模态框状态
const showAddTripModal = ref(false)

// 加号按钮点击事件处理函数
const handleAddButtonClick = () => {
  showAddTripModal.value = true
}

// 处理行程添加成功
const handleTripAdded = (newTrip) => {
  // 刷新行程数据
  tripStore.switchTripType(newTrip.isPersonal ? 'my' : 'recommended')
  tripStore.selectTrip(newTrip.id)
}
</script>

<style scoped>
.trip-planning-view {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 85px);
  position: relative; /* 添加相对定位，作为悬浮按钮的参考 */
  color: var(--text-color);
  gap: 0.5rem;
  padding: 0.5rem;
}

.part-1 {
  width: 20%;
  border-radius: 0.5rem;
  overflow-y: auto;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

.part-2 {
  width: 30%;
  border-radius: 0.5rem;
  padding: 0.5rem;
  overflow-y: auto;
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

.part-3 {
  width: 50%;
  border-radius: 1rem;
  overflow: hidden; /* 确保地图不会溢出容器 */
  background-color: var(--card-bg);
  transition: all 0.3s ease;
}

/* 悬浮加号按钮样式 */
.floating-add-button {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
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
</style>
