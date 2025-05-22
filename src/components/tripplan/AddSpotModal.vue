<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>添加地点/活动</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <div class="search-container">
        <input
          v-model="searchText"
          type="text"
          placeholder="搜索地点..."
          @keyup.enter="searchPlaces"
        />
        <button class="search-button" @click="searchPlaces">搜索</button>
      </div>

      <div class="search-results" v-if="places.length > 0">
        <div v-for="place in places" :key="place.id" class="place-item" @click="selectPlace(place)">
          <div class="place-name">{{ place.name }}</div>
          <div class="place-address">{{ place.address }}</div>
        </div>
      </div>

      <div class="no-results" v-else-if="searchPerformed && !isLoading">没有找到相关地点</div>

      <div class="loading" v-if="isLoading">
        <div class="spinner"></div>
        <span>搜索中...</span>
      </div>

      <div class="selected-place" v-if="selectedPlace">
        <h4>已选择地点</h4>
        <div class="place-details">
          <div class="place-name">{{ selectedPlace.name }}</div>
          <div class="place-address">{{ selectedPlace.address }}</div>
        </div>

        <div class="form-group">
          <label for="time">开放时间</label>
          <input id="time" v-model="placeTime" type="text" placeholder="例如: 10:00-18:00" />
        </div>

        <div class="form-group">
          <label for="price">价格</label>
          <input id="price" v-model="placePrice" type="text" placeholder="例如: 免费或30r" />
        </div>

        <div class="form-group">
          <label for="desc">描述</label>
          <textarea id="desc" v-model="placeDesc" placeholder="添加描述..."></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button class="add-button" :disabled="!selectedPlace" @click="addSpot">添加</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useMapStore } from '../../stores/mapStore'

const props = defineProps({
  show: Boolean,
  tripId: Number,
  dayIndex: Number,
})

const emit = defineEmits(['close', 'spotAdded'])

const mapStore = useMapStore()
const searchText = ref('')
const places = ref<any[]>([])
const isLoading = ref(false)
const selectedPlace = ref<any>(null)
const searchPerformed = ref(false)

// 地点详情
const placeTime = ref('')
const placePrice = ref('')
const placeDesc = ref('')

// 初始化地图API
if (!mapStore.isMapInitialized) {
  mapStore.initMap()
}

// 搜索地点
const searchPlaces = async () => {
  if (!searchText.value.trim()) return

  isLoading.value = true
  searchPerformed.value = true
  selectedPlace.value = null

  try {
    const result = await mapStore.searchPlaces(searchText.value)
    places.value = result || []
  } catch (error) {
    console.error('搜索出错:', error)
    places.value = []
  } finally {
    isLoading.value = false
  }
}

// 选择地点
const selectPlace = (place: any) => {
  selectedPlace.value = place
  // 默认填充描述
  placeDesc.value = place.address || ''
}

// 添加地点到行程
const addSpot = async () => {
  if (!selectedPlace.value || props.tripId === undefined || props.dayIndex === undefined) return

  try {
    // 构建新地点数据
    const newSpot = {
      name: selectedPlace.value.name,
      lanlat: [selectedPlace.value.location.lng, selectedPlace.value.location.lat],
      desc: placeDesc.value,
      img: selectedPlace.value.photos[0].url || '', // 可以添加默认图片或上传功能
      time: placeTime.value,
      price: placePrice.value,
    }

    // 通知父组件地点已添加
    emit('spotAdded', newSpot)
    closeModal()
  } catch (error) {
    console.error('添加地点失败:', error)
    alert('添加地点失败，请重试')
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
  // 重置状态
  searchText.value = ''
  places.value = []
  selectedPlace.value = null
  placeTime.value = ''
  placePrice.value = ''
  placeDesc.value = ''
  searchPerformed.value = false
}

// 监听show属性变化，初始化状态
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      // 模态框打开时初始化
      searchText.value = ''
      places.value = []
      selectedPlace.value = null
      placeTime.value = ''
      placePrice.value = ''
      placeDesc.value = ''
      searchPerformed.value = false
    }
  },
)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

.search-container {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
}

.search-container input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  padding: 0 1rem;
}

.place-item {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.place-item:hover {
  background-color: var(--hover-bg);
}

.place-name {
  font-weight: 600;
  color: var(--text-color);
}

.place-address {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.7;
  margin-top: 0.25rem;
}

.no-results,
.loading {
  padding: 1rem;
  text-align: center;
  color: var(--text-color);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.selected-place {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.selected-place h4 {
  margin-top: 0;
  color: var(--text-color);
}

.place-details {
  background-color: var(--bg-color);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-color);
}

.add-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
