<template>
  <div class="card w-96 bg-base-100 shadow-xl mx-auto">
    <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="$emit('close')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <div class="card-body">
      <div class="tabs tabs-boxed mb-4">
        <a :class="['tab', { 'tab-active': activeTab === 'login' }]" @click="activeTab = 'login'">
          登录
        </a>
        <a
          :class="['tab', { 'tab-active': activeTab === 'register' }]"
          @click="activeTab = 'register'"
        >
          注册
        </a>
      </div>

      <!-- 登录表单 -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <h2 class="text-2xl font-bold text-center">用户登录</h2>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">用户名</span>
          </label>
          <input
            id="loginUsername"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">密码</span>
          </label>
          <input
            id="loginPassword"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">登录</button>
        <div
          v-if="loginMessage"
          :class="{ 'alert alert-error': loginError, 'alert alert-success': !loginError }"
          class="mt-4"
        >
          <span>{{ loginMessage }}</span>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
        <h2 class="text-2xl font-bold text-center">用户注册</h2>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">用户名</span>
          </label>
          <input
            id="registerUsername"
            v-model="registerForm.username"
            type="text"
            placeholder="请输入用户名"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">密码</span>
          </label>
          <input
            id="registerPassword"
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            class="input input-bordered w-full"
            required
          />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">确认密码</span>
          </label>
          <input
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            class="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">注册</button>
        <div
          v-if="registerMessage"
          :class="{ 'alert alert-error': registerError, 'alert alert-success': !registerError }"
          class="mt-4"
        >
          <span>{{ registerMessage }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 当前激活的标签页
const activeTab = ref('login')

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
})

// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

// 消息提示
const loginMessage = ref('')
const loginError = ref(false)
const registerMessage = ref('')
const registerError = ref(false)

// 定义事件
const emit = defineEmits(['login-success', 'close'])

// 登录处理
const handleLogin = async () => {
  try {
    loginMessage.value = ''

    // 模拟登录成功（实际项目中应该调用真实API）
    const response = await axios.post('api/auth/login', {
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    console.log('登录成功:', response.data)
    // 模拟登录成功响应
    // const mockResponse = {
    //   data: {
    //     token: 'mock-token-' + Date.now(),
    //     user: {
    //       id: 1,
    //       username: loginForm.value.username,
    //       avatar: '/user/jhd.jpg',
    //     },
    //   },
    // }

    // 保存token到localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // 显示成功消息
    loginError.value = false
    loginMessage.value = '登录成功！'

    // 发出登录成功事件
    setTimeout(() => {
      emit('login-success')
    }, 1000)
  } catch (err: any) {
    console.error('登录失败:', err)
    loginError.value = true
    loginMessage.value = err.response?.data?.message || '登录失败，请检查用户名和密码'
  }
}

// 注册处理
const handleRegister = async () => {
  try {
    registerMessage.value = ''

    // 验证两次密码是否一致
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      registerError.value = true
      registerMessage.value = '两次输入的密码不一致'
      return
    }

    const response = await axios.post('/api/auth/register', {
      username: registerForm.value.username,
      password: registerForm.value.password,
    })

    if (response.status === 201) {
      registerError.value = false
      registerMessage.value = '注册成功！请登录'

      // 清空表单
      registerForm.value = {
        username: '',
        password: '',
        confirmPassword: '',
      }

      // 切换到登录页
      setTimeout(() => {
        activeTab.value = 'login'
      }, 1500)
    }
  } catch (err: any) {
    console.error('注册失败:', err)
    registerError.value = true
    registerMessage.value = err.response?.data?.message || '注册失败，请稍后再试'
  }
}

// 检查用户是否已登录
onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    // 用户已登录，可以在这里添加重定向逻辑
    // window.location.href = '/dashboard';
  }
})
</script>

<style scoped>
/* 使用daisyUI组件库样式，无需自定义CSS */
</style>
