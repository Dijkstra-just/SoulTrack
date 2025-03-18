<template>
  <nav class="main-nav">
    <div class="nav-content">
      <div class="nav-left">
        <div class="nav-links">
          <!-- 主题切换 -->

          <div class="theme-switcher">
            <label class="swap swap-rotate">
              <!-- this hidden checkbox controls the state -->
              <input
                type="checkbox"
                class="theme-controller"
                :checked="isDarkTheme"
                @change="toggleTheme"
              />

              <!-- sun icon -->
              <svg
                class="swap-off h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                />
              </svg>

              <!-- moon icon -->
              <svg
                class="swap-on h-10 w-10 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                />
              </svg>
            </label>
          </div>

          <router-link to="/trip-planning" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,4H18V2H16V4H8V2H6V4H5A2,2 0 0,0 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M19,8H5V6H19V8Z"
              />
            </svg>
            <span>行程规划</span>
          </router-link>

          <router-link to="/3d-explore" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6.5A5.5,5.5 0 0,1 17.5,12A5.5,5.5 0 0,1 12,17.5A5.5,5.5 0 0,1 6.5,12A5.5,5.5 0 0,1 12,6.5M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"
              />
            </svg>
            <span>3D探索</span>
          </router-link>
        </div>
      </div>

      <div class="nav-center">
        <router-link to="/" class="logo" @click="toggleRoute">
          <h1>SoulTrack</h1>
        </router-link>
      </div>

      <div class="nav-right">
        <div class="nav-links">
          <router-link to="/forum" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"
              />
            </svg>
            <span>论坛</span>
          </router-link>

          <router-link to="/summary" class="nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"
              />
            </svg>
            <span>总结</span>
          </router-link>
        </div>

        <div class="avatar-container" @click="isLoggedIn = !isLoggedIn">
          <img
            :src="isLoggedIn ? '/user/jhd.jpg' : '/path/to/default-avatar.jpg'"
            alt="用户头像"
            class="avatar-img"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

//双向路由的绑定
const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(true)
// const showLogin = ref(false)

const toggleRoute = () => {
  if (route.path === '/') {
    router.push('/info-display')
  } else if (route.path === '/info-display') {
    router.push('/')
  }
}

// 创建一个响应式变量来跟踪当前主题状态
const isDarkTheme = ref(false)

// 切换主题的函数
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value

  // 根据当前状态设置 HTML 的 data-theme 属性
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
}

// 组件挂载时初始化主题
onMounted(() => {
  // 检查当前系统偏好或本地存储的主题设置
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const savedTheme = localStorage.getItem('theme')

  // 根据保存的主题或系统偏好设置初始主题
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
  } else {
    isDarkTheme.value = prefersDark
  }

  // 应用初始主题
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')

  // 监听系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDarkTheme.value = e.matches
      document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
    }
  })
})
</script>

<style scoped>
.main-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  background: var(--card-bg);
  color: var(--text-color);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-content {
  /* max-width: 1200px; */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.nav-left,
.nav-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.nav-left {
  justify-content: flex-start;
}

.nav-right {
  justify-content: flex-end;
  gap: 1rem;
}

.nav-center {
  display: flex;
  justify-content: center;
  flex: 1;
}

.nav-center .logo {
  text-decoration: none;
}

.nav-center h1 {
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #0071e3 0%, #42b983 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: var(--hover-bg);
  color: var(--primary-color);
}

.nav-link svg {
  opacity: 0.8;
}

.avatar-container {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .nav-link span {
    display: none;
  }

  .nav-links {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .nav-links {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.4rem;
  }
}
</style>
