<template>
  <div class="app-container bg-base-100">
    <!-- 欢迎区域和上传区域合并 -->
    <div class="hero bg-base-200 rounded-box mb-8 py-8">
      <div class="hero-content flex-col lg:flex-row gap-8 w-full max-w-5xl">
        <!-- 欢迎文本 -->
        <div class="text-center lg:text-left lg:w-1/2">
          <h1 class="text-4xl font-bold">Welcome to Luma!</h1>
          <p class="py-4">Create your first NeRF capture today.</p>
          <div class="flex justify-center lg:justify-start gap-2 mt-2">
            <button class="btn btn-sm btn-outline">Best Practices</button>
            <button class="btn btn-sm btn-outline">Community</button>
          </div>
        </div>

        <!-- 上传区域 -->
        <div class="upload-box card bg-base-100 shadow-xl w-full lg:w-1/2">
          <div class="card-body items-center text-center">
            <div class="upload-icon text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h2 class="card-title">三维重建</h2>
            <p>上传照片或视频进行三维重建</p>
            <div class="card-actions">
              <label for="file-upload" class="btn btn-primary">选择文件</label>
              <input
                id="file-upload"
                type="file"
                class="hidden"
                multiple
                @change="handleFileUpload"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型网格区域 -->
    <div class="models-section container mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6">Featured Captures</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(model, index) in modelList"
          :key="index"
          class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
          @click="viewModel(model.source)"
        >
          <figure class="h-48 relative overflow-hidden">
            <div class="absolute inset-0">
              <ThreeDViewer :source="model.source" />
            </div>
            <div
              class="absolute bottom-2 left-2 bg-base-200 bg-opacity-70 px-2 py-1 rounded-md text-xs"
            >
              {{ model.author }}
            </div>
          </figure>
          <div class="card-body p-4">
            <h3 class="card-title text-lg">{{ model.title }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 模型查看对话框 -->
    <div
      v-if="selectedModel"
      class="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col"
      @click="closeViewerOnBackdrop"
    >
      <div class="p-4 flex justify-end">
        <button
          class="btn btn-circle btn-primary text-white text-xl hover:bg-primary-focus"
          @click="closeViewer"
          style="
            font-size: 24px;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          ✕
        </button>
      </div>
      <div class="flex-1 flex items-center justify-center p-4">
        <div class="w-full h-full max-w-5xl max-h-[80vh]" @click.stop>
          <ThreeDViewer :source="selectedModel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ThreeDViewer from '../components/3DGS/ThreeDViewer.vue'

// 模型列表
const modelList = [
  {
    title: 'Beeldsss',
    author: '@seweso',
    source: 'https://lumalabs.ai/capture/80406aa2-1bbf-48d6-9f65-5adeb48f5692',
  },
  {
    title: 'Church Pribelce Slovakia',
    author: '@pinfoto',
    source: 'https://lumalabs.ai/capture/4b2a92dc-983f-433e-aa43-f89db0ea5917',
  },
  {
    title: 'Dakota Hogback I-70 Roadcut',
    author: '@VibrantNebula_Luma',
    source: 'https://lumalabs.ai/capture/dbf30400-7e8e-43e5-a9e9-43836b486c53',
  },
  {
    title: 'Amor',
    author: '@LajoArt',
    source: 'https://lumalabs.ai/capture/6e02c0a0-e182-431b-88aa-110b2eeff8f1',
  },
]

// 选中的模型
const selectedModel = ref<string | null>(null)

// 上传状态
const isUploading = ref(false)
const uploadProgress = ref(0)

// 查看模型
function viewModel(source: string) {
  selectedModel.value = source
}

// 关闭查看器
function closeViewer() {
  selectedModel.value = null
}

// 点击背景关闭查看器
function closeViewerOnBackdrop(event: Event) {
  // 只有当点击的是背景元素时才关闭
  if (event.target === event.currentTarget) {
    closeViewer()
  }
}

// 添加键盘事件监听器，支持ESC键关闭
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedModel.value) {
    closeViewer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 处理文件上传
function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)
  isUploading.value = true
  uploadProgress.value = 0

  // 模拟上传进度
  const interval = setInterval(() => {
    uploadProgress.value += 5
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        isUploading.value = false
        uploadProgress.value = 0
        // 这里可以添加上传成功后的处理逻辑
        alert('文件上传成功，开始处理三维重建...')
      }, 500)
    }
  }, 200)

  // 这里应该是实际的上传逻辑
  console.log(
    '上传文件:',
    files.map((f) => f.name),
  )
}
</script>

<style scoped>
/* 使用daisyUI类，只保留必要的自定义样式 */
.app-container {
  min-height: 100vh;
}

/* 上传进度条样式 */
.progress-container {
  width: 100%;
  margin-top: 1rem;
}

/* 3D模型预览容器样式 */
.model-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 确保ThreeDViewer组件在卡片中正确显示 */
:deep(.viewer-container) {
  width: 100%;
  height: 100%;
}

/* 应用滤镜效果增强视觉效果 */
:deep(canvas) {
  filter: brightness(1.1) contrast(90%) saturate(1.2);
}

/* 添加卡片悬停效果 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* 上传区域动画效果 */
.upload-icon svg {
  transition: transform 0.3s ease;
}

.upload-box:hover .upload-icon svg {
  transform: scale(1.1);
}
</style>

<!-- <template>
  <div class="three-d-explore-view">
    <div class="iframe-container">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>正在加载3D内容...</p>
      </div>
      <iframe
        src="https://projects.markkellogg.org/threejs/demo_gaussian_splats_3d.php"
        frameborder="0"
        @load="handleIframeLoad"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      >
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iframeLoaded = ref(false)
const isLoading = ref(true)

const handleIframeLoad = () => {
  iframeLoaded.value = true
  isLoading.value = false
}
</script>

<style scoped>
.three-d-explore-view {
  text-align: center;
  height: 100%;
}

.iframe-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 80px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style> -->
