<template>
  <div v-if="show" class="modal modal-open" @click.self="closeModal">
    <div class="modal-box bg-base-200">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-lg">添加新行程</h3>
        <button class="btn btn-sm btn-circle btn-ghost" @click="closeModal">✕</button>
      </div>

      <div class="form-control w-full">
        <div class="mb-3">
          <label class="label" for="title">
            <span class="label-text">行程标题</span>
          </label>
          <input
            id="title"
            v-model="tripTitle"
            type="text"
            placeholder="例如: 北京三日游"
            class="input input-bordered w-full"
          />
        </div>

        <div class="mb-3">
          <label class="label" for="alt">
            <span class="label-text">目的地</span>
          </label>
          <input
            id="alt"
            v-model="tripAlt"
            type="text"
            placeholder="例如: 北京"
            class="input input-bordered w-full"
          />
        </div>

        <div class="mb-3">
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

        <div class="mb-3">
          <label class="label" for="duration">
            <span class="label-text">行程时长</span>
          </label>
          <input
            id="duration"
            v-model="tripDuration"
            type="text"
            placeholder="例如: 3天2晚"
            class="input input-bordered w-full"
          />
        </div>

        <!-- <div class="mb-3">
          <label class="label" for="image">
            <span class="label-text">封面图片URL</span>
          </label>
          <input
            id="image"
            v-model="tripImage"
            type="text"
            placeholder="输入图片URL"
            class="input input-bordered w-full"
          />
        </div> -->

        <div class="mb-3">
          <label class="label">
            <span class="label-text">是否为个人行程</span>
          </label>
          <div class="flex gap-4">
            <label class="label cursor-pointer">
              <input type="radio" v-model="isPersonal" :value="true" class="radio radio-primary" />
              <span class="label-text ml-2">是</span>
            </label>

            <label class="label cursor-pointer">
              <input type="radio" v-model="isPersonal" :value="false" class="radio radio-primary" />
              <span class="label-text ml-2">否</span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeModal">取消</button>
        <button class="btn btn-primary" :disabled="!isFormValid" @click="addTrip">创建行程</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTripStore } from '../../stores/tripStore'
import { useMapStore } from '../../stores/mapStore'
const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'tripAdded'])

const tripStore = useTripStore()
const mapStore = useMapStore()
// 表单数据
const tripTitle = ref('')
const tripAlt = ref('')
const tripDays = ref(1)
const tripDuration = ref('')
const tripImage = ref() // 默认图片
const isPersonal = ref(true)

// 表单验证
const isFormValid = computed(() => {
  return (
    tripTitle.value.trim() !== '' &&
    tripAlt.value.trim() !== '' &&
    tripDays.value > 0 &&
    tripDuration.value.trim() !== ''
    // tripImage.value.trim() !== ''
  )
})

// 添加行程
const addTrip = async () => {
  if (!isFormValid.value) return
  try {
    const result = await mapStore.searchPlaces(tripAlt.value)
    // console.log('搜索结果:', result)
    tripImage.value = result[0].photos[0].url || []
  } catch (error) {
    console.error('搜索出错:', error)
  }
  try {
    // 构建新行程数据
    const newTrip = {
      title: tripTitle.value,
      alt: tripAlt.value,
      duration: tripDuration.value,
      image: tripImage.value,
      spots: 0,
      details: {
        days: tripDays.value,
        address: Array(tripDays.value)
          .fill(null)
          .map(() => []),
      },
    }

    // 使用tripStore添加行程
    const addedTrip = await tripStore.addTrip(newTrip, isPersonal.value)

    // 通知父组件行程已添加
    emit('tripAdded', addedTrip)
    closeModal()
  } catch (error) {
    console.error('添加行程失败:', error)
    alert('添加行程失败，请重试')
  }
}

// 关闭模态框
const closeModal = () => {
  emit('close')
  // 重置表单
  tripTitle.value = ''
  tripAlt.value = ''
  tripDays.value = 1
  tripDuration.value = ''
  tripImage.value = '/card-img/changde/all.jpg'
  isPersonal.value = true
}
</script>

<style scoped>
/* 使用daisyUI样式，大部分样式已由daisyUI提供，这里只添加一些自定义样式 */
.modal-box {
  color: var(--text-color);
  max-width: 500px;
  max-height: 80vh;
}

/* 确保表单元素在暗色主题下有正确的颜色 */
.input,
.radio {
  color: var(--text-color);
}

/* 确保禁用按钮样式正确 */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
