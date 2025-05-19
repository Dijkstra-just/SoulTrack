<template>
  <div class="trip-info p-2">
    <div v-if="tripStore.selectedTrip" class="trip-details">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold">{{ tripStore.selectedTrip.title }}</h2>
        <div class="badge badge-primary">{{ tripStore.selectedTrip.duration }}</div>
      </div>

      <!-- 日期标签导航 -->
      <div class="tabs tabs-boxed mb-4">
        <div
          class="tab"
          :class="{ 'tab-active': tripStore.activeTab === 'overview' }"
          @click="tripStore.switchActiveTab('overview')"
        >
          总览
        </div>
        <div
          v-for="(day, index) in tripStore.selectedTrip.details?.address"
          :key="index"
          class="tab"
          :class="{ 'tab-active': tripStore.activeTab === `day${index + 1}` }"
          @click="tripStore.switchActiveTab(`day${index + 1}`)"
        >
          DAY {{ index + 1 }}
        </div>
        <div class="tab">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </div>
      </div>

      <!-- 总览内容 -->
      <div v-if="tripStore.activeTab === 'overview'" class="overview-content">
        <!-- 总览中显示所有天的行程简略信息 -->
        <div v-if="tripStore.selectedTrip.details" class="space-y-4">
          <div
            v-for="(day, dayIndex) in tripStore.selectedTrip.details.address"
            :key="dayIndex"
            class="card bg-base-300 shadow-sm hover:shadow cursor-pointer"
            @click="tripStore.switchActiveTab(`day${dayIndex + 1}`)"
          >
            <div class="card-body p-3">
              <div class="flex justify-between items-center">
                <h3 class="card-title text-base">DAY {{ dayIndex + 1 }}</h3>
              </div>
              <div class="divider my-1"></div>
              <div class="space-y-2">
                <div
                  v-for="(spot, spotIndex) in day"
                  :key="spotIndex"
                  class="flex items-center gap-2"
                >
                  <div class="badge badge-primary">{{ spotIndex + 1 }}</div>
                  <div class="font-medium">{{ spot.name }}</div>
                </div>
                <div v-if="day.length === 0" class="text-sm opacity-70 italic">暂无景点</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pending-plan">
          <h3>待规划</h3>
          <div class="day-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- 特定日期内容 -->
      <div
        v-for="(day, dayIndex) in tripStore.selectedTrip.details?.address"
        :key="dayIndex"
        v-show="tripStore.activeTab === `day${dayIndex + 1}`"
        class="day-content"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-bold">
            DAY {{ dayIndex + 1 }}
            <span class="text-sm font-normal text-primary ml-2 cursor-pointer">添加备注</span>
          </h3>
        </div>

        <div class="space-y-2">
          <div
            v-for="(spot, spotIndex) in day"
            :key="spot.id"
            class="card bg-base-300 shadow-sm hover:shadow-md cursor-pointer transition-all"
          >
            <div class="card-body p-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg overflow-hidden bg-primary flex items-center justify-center text-white relative"
                >
                  <div class="absolute top-0 left-0 w-full bg-black/50 text-xs py-0.5 text-center">
                    景点
                  </div>
                  <img
                    :src="spot.img"
                    alt="景点图片"
                    v-if="spot.img"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h4 class="font-medium">{{ spot.name || '景点' + spot.id }}</h4>
                  <div class="flex gap-3 text-xs opacity-80">
                    <div>门票 {{ spot.price }}</div>
                    <div>{{ spot.time }}</div>
                  </div>
                  <p class="text-sm mt-1">{{ spot.desc }}</p>

                  <div
                    v-if="spotIndex < day.length - 1"
                    class="flex items-center gap-1 text-xs opacity-70 mt-2 pt-2 border-t border-dashed border-base-content/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span
                      >{{ Math.floor(Math.random() * 5) + 1 }}km |
                      {{ Math.floor(Math.random() * 20) + 5 }}min</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="card bg-base-200 shadow-sm hover:shadow-md cursor-pointer transition-all"
            @click="openAddSpotModal(dayIndex)"
          >
            <div class="card-body p-3 flex flex-row items-center justify-center">
              <div class="btn btn-circle btn-sm btn-ghost mr-2">+</div>
              <div class="font-medium">添加地点/活动</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-trip-selected">
      <p>请从左侧选择一个行程查看详情</p>
    </div>

    <!-- 添加地点模态框 -->
    <AddSpotModal
      :show="showAddSpotModal"
      :tripId="tripStore.selectedTrip?.id"
      :dayIndex="currentDayIndex"
      @close="showAddSpotModal = false"
      @spotAdded="handleSpotAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { useTripStore } from '../../stores/tripStore'
import { ref } from 'vue'
import AddSpotModal from './AddSpotModal.vue'

// 使用trip store
const tripStore = useTripStore()

// 添加地点模态框状态
const showAddSpotModal = ref(false)
const currentDayIndex = ref(0)

// 打开添加地点模态框
const openAddSpotModal = (dayIndex: number) => {
  currentDayIndex.value = dayIndex
  showAddSpotModal.value = true
}

// 处理地点添加成功
const handleSpotAdded = async (newSpot: any) => {
  try {
    if (tripStore.selectedTrip && currentDayIndex.value !== undefined) {
      // 使用tripStore的addSpotToTrip方法添加地点到数据库
      await tripStore.addSpotToTrip(tripStore.selectedTrip.id, currentDayIndex.value, newSpot)
    }
  } catch (error) {
    console.error('添加地点失败:', error)
    alert('添加地点失败，请重试')
  }
}
</script>

<style scoped>
.trip-info {
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
  background-color: var(---card-bg);
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trip-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.trip-duration {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: -0.5rem;
}

/* 日期标签样式 */
.day-tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.tabs {
  background-color: --card-bg;
}
.tab {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background-color: var(--bg-color);
}

.tab.active {
  background-color: var(--text-color);
  color: var(--bg-color);
  border-color: var(--text-color);
}

.edit-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 36px;
  height: 36px;
}

/* 总览内容样式 */
.overview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.all-days-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-overview,
.pending-plan {
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  box-shadow: var(--card-shadow);
}

.day-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.day-location {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
  margin: 0.3rem 0 0.8rem;
}

.day-spots {
  font-size: 0.9rem;
  color: var(--text-color);
  line-height: 1.5;
}

.spot-separator {
  margin: 0 0.3rem;
  color: var(--border-color);
}

.day-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color);
  opacity: 0.5;
}

/* 每天详细内容样式 */
.day-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.add-note {
  font-size: 0.8rem;
  font-weight: normal;
  color: var(--primary-color);
  margin-left: 0.5rem;
}

.spots-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spot-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.spot-icon {
  flex: 0 0 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-type {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0;
  text-align: center;
}

.spot-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spot-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.spot-info {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.8;
}

.spot-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-color);
  margin: 0;
}

.spot-distance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border-color);
}

.distance-icon {
  display: flex;
  align-items: center;
}

.add-spot {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  cursor: pointer;
  color: var(--primary-color);
  box-shadow: var(--card-shadow);
}

.add-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
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
