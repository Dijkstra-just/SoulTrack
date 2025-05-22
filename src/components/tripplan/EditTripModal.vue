<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>编辑行程信息</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>

      <div class="form-container">
        <div class="form-group">
          <label for="title">行程标题</label>
          <input id="title" v-model="tripTitle" type="text" placeholder="输入行程标题" />
        </div>

        <div class="form-group">
          <label for="duration">行程时长</label>
          <input id="duration" v-model="tripDuration" type="text" placeholder="例如: 3天2晚" />
        </div>

        <div class="form-group">
          <label class="label" for="days">
            <span class="label-text">天数</span>
          </label>
          <input
            id="days"
            v-model.number="tripDays"
            type="number"
            min="1"
            max="30"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-group">
          <label for="description">行程描述</label>
          <textarea
            id="description"
            v-model="tripDescription"
            placeholder="添加行程描述..."
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">取消</button>
        <button class="save-button" @click="saveTrip">保存</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  trip: Object,
})

const emit = defineEmits(['close', 'tripUpdated'])

// 行程信息
const tripTitle = ref('')
const tripDays = ref(1)
const tripDuration = ref('')
const tripDescription = ref('')

// 保存行程信息
const saveTrip = async () => {
  if (!tripTitle.value.trim()) {
    alert('请输入行程标题')
    return
  }

  try {
    // 构建更新后的行程数据
    const updatedTrip = {
      ...props.trip,
      title: tripTitle.value,
      duration: tripDuration.value,
      description: tripDescription.value,
      details: {
        days: tripDays.value,
        address: Array(tripDays.value)
          .fill(null)
          .map(() => []),
      },
    }

    // 通知父组件行程已更新
    emit('tripUpdated', updatedTrip)
    closeModal()
  } catch (error) {
    console.error('更新行程失败:', error)
    alert('更新行程失败，请重试')
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
}

// 监听show属性变化，初始化状态
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.trip) {
      // 模态框打开时初始化数据
      tripTitle.value = props.trip.title || ''
      tripDuration.value = props.trip.duration || ''
      tripDescription.value = props.trip.description || ''
    }
  },
  { immediate: true },
)

// 监听trip属性变化
watch(
  () => props.trip,
  (newVal) => {
    if (newVal && props.show) {
      tripTitle.value = newVal.title || ''
      tripDuration.value = newVal.duration || ''
      tripDescription.value = newVal.description || ''
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
  background-color: var(--card-bg, #ffffff);
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--card-shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #eaeaea);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color, #333333);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color, #333333);
  opacity: 0.7;
}

.close-button:hover {
  opacity: 1;
}

.form-container {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #333333);
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #eaeaea);
  border-radius: 8px;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid var(--border-color, #eaeaea);
}

.cancel-button,
.save-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--border-color, #eaeaea);
  color: var(--text-color, #333333);
}

.save-button {
  background-color: var(--primary-color, #3b82f6);
  border: 1px solid var(--primary-color, #3b82f6);
  color: white;
}

.cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.save-button:hover {
  background-color: var(--primary-hover, #2563eb);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
