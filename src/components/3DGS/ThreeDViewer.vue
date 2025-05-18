<template>
  <div class="viewer-container relative w-full h-full" ref="viewerDiv">
    <!-- 渲染器将在这里创建canvas元素 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-base-300 bg-opacity-50"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AmbientLight,
  PointLight,
  AnimationMixer,
  Clock,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { LumaSplatsThree } from '@lumaai/luma-web'
import { Color, FogExp2 } from 'three'

// 定义props
const props = defineProps<{
  source: string
}>()

// 创建响应式引用
const viewerDiv = ref<HTMLElement | null>(null)
const loading = ref(true)
let renderer: WebGLRenderer
let camera: PerspectiveCamera
let controls: OrbitControls
let scene: Scene
let mixer: AnimationMixer | undefined
const clock = new Clock()

// 初始化Three.js场景
onMounted(() => {
  if (!viewerDiv.value) return

  // 创建渲染器
  renderer = new WebGLRenderer({ antialias: true })
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'

  viewerDiv.value.appendChild(renderer.domElement)

  // 创建相机
  camera = new PerspectiveCamera(75, 1, 0.1, 1000)
  camera.position.z = 4.0
  camera.position.y = 1.2
  camera.position.x = 1.2

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // 创建场景
  scene = new Scene()
  scene.fog = new FogExp2(new Color(0xf8f8f8).convertLinearToSRGB(), 0.15)
  scene.background = scene.fog.color

  // 添加Luma AI的3D Gaussian Splatting
  const splat = new LumaSplatsThree({
    source: props.source,
    onProgress: () => {
      // 加载进度更新
    },
    onLoad: () => {
      // 加载完成
      loading.value = false
    },
  })
  scene.add(splat)

  // 添加光源
  const light = new AmbientLight(0xffffff)
  scene.add(light)

  const pointLight = new PointLight(0xffffff, 1.5, 2000)
  pointLight.position.set(0, 600, 0)
  pointLight.castShadow = true
  scene.add(pointLight)

  // 加载GLTF模型
  loadGLTFModel()

  // 开始动画循环
  renderer.setAnimationLoop(frameLoop)

  // 处理窗口大小变化
  window.addEventListener('resize', handleResize)
  handleResize()
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (renderer) {
    renderer.setAnimationLoop(null)
    renderer.dispose()
  }

  window.removeEventListener('resize', handleResize)
})

// 加载GLTF模型
async function loadGLTFModel() {
  const loader = new GLTFLoader()
  try {
    const gltf = await loader.loadAsync('assets/model/model2.glb')
    const model = gltf.scene

    model.position.set(-1.5, -1.3, 0.5)
    model.scale.set(0.8, 0.8, 0.8)
    model.rotation.set(0, Math.PI / 2.2, 0)

    scene.add(model)

    if (gltf.animations.length > 0) {
      mixer = new AnimationMixer(model)

      const action = mixer.clipAction(gltf.animations[0])
      action.play()
    }
  } catch (error) {
    console.error('Error loading GLTF model:', error)
  }
}

// 动画帧循环
function frameLoop() {
  const delta = clock.getDelta()

  if (mixer) {
    mixer.update(delta)
  }

  controls.update()
  renderer.render(scene, camera)
}

// 处理窗口大小变化
function handleResize() {
  if (!renderer) return

  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  if (canvas.width !== width || canvas.height !== height) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
}
</script>

<style scoped>
.viewer-container {
  overflow: hidden;
  border-radius: 0.5rem;
}

/* 应用原始HTML中的滤镜效果 */
:deep(canvas) {
  filter: brightness(1.1) contrast(90%) saturate(1.2);
}
</style>
