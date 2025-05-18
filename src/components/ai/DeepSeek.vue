<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 聊天历史记录
const chatHistory = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
// 用户输入
const userInput = ref('')
// 加载状态
const isLoading = ref(false)
// 模型信息
const modelInfo = ref({ name: 'DeepSeek-R1-14B', status: '未连接' })

// 发送消息到Ollama
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 添加用户消息到历史记录
  chatHistory.value.push({ role: 'user', content: userInput.value })

  // 保存用户输入并清空输入框
  const message = userInput.value
  userInput.value = ''

  // 设置加载状态
  isLoading.value = true

  try {
    // 使用axios调用本地Ollama API
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:4b',
      prompt: message,
      stream: false,
    })

    // 添加AI回复到历史记录
    console.log(response.data)
    chatHistory.value.push({ role: 'assistant', content: response.data.response })
  } catch (error) {
    console.error('调用Ollama API失败:', error)
    chatHistory.value.push({
      role: 'assistant',
      content:
        '抱歉，我无法连接到DeepSeek模型。请确保Ollama正在运行，并且已加载deepseek-r1:14b模型。',
    })
  } finally {
    isLoading.value = false
  }
}

// 检查Ollama服务状态
const checkOllamaStatus = async () => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags')
    const data = response.data
    const deepseekModel = data.models.find((m) => m.name.includes('deepseek-r1'))

    if (deepseekModel) {
      modelInfo.value.status = '已连接'
    } else {
      modelInfo.value.status = '模型未加载'
    }
  } catch (error) {
    modelInfo.value.status = '无法连接'
  }
}

// 组件挂载时检查Ollama状态
onMounted(() => {
  checkOllamaStatus()
})
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>SoulTrack AI 助手</h1>
      <div class="model-info">
        <span class="model-name">{{ modelInfo.name }}</span>
        <span class="model-status" :class="{ connected: modelInfo.status === '已连接' }">
          {{ modelInfo.status }}
        </span>
      </div>
    </div>

    <div class="chat-messages">
      <div v-if="chatHistory.length === 0" class="welcome-message">
        <h2>欢迎使用 DeepSeek AI 助手</h2>
        <p>
          这是一个基于本地运行的DeepSeek-R1-14B大语言模型。您可以向它提问任何问题，它会尽力回答。
        </p>
      </div>

      <div
        v-for="(message, index) in chatHistory"
        :key="index"
        class="message"
        :class="message.role"
      >
        <div class="message-avatar">
          {{ message.role === 'user' ? '👤' : '🤖' }}
        </div>
        <div class="message-content">
          <div class="message-text" v-html="message.content.replace(/\n/g, '')"></div>
        </div>
      </div>

      <div v-if="isLoading" class="message assistant loading">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <textarea
        v-model="userInput"
        placeholder="输入您的问题..."
        @keydown.enter.prevent="sendMessage"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
        <span v-if="!isLoading">发送</span>
        <span v-else>处理中...</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 800px;
  background-color: var(--bg-color, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h1 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-color, #333);
}

.model-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.model-name {
  font-weight: 500;
  color: var(--text-color, #333);
}

.model-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background-color: #f0f0f0;
  color: #666;
}

.model-status.connected {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.welcome-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-color, #333);
  opacity: 0.8;
}

.welcome-message h2 {
  margin-bottom: 1rem;
}

.message {
  display: flex;
  gap: 1rem;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.message-content {
  background-color: var(--card-bg, #f5f5f5);
  padding: 1rem;
  border-radius: 12px;
  color: var(--text-color, #333);
}

.message.user .message-content {
  background-color: var(--primary-color, #4a6fa5);
  color: white;
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--text-color, #333);
  opacity: 0.6;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.chat-input {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  gap: 1rem;
}

.chat-input textarea {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  resize: none;
  height: 60px;
  font-family: inherit;
  font-size: 1rem;
  background-color: var(--input-bg, #f9f9f9);
  color: var(--text-color, #333);
}

.chat-input button {
  padding: 0 1.5rem;
  background-color: var(--primary-color, #4a6fa5);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background-color: var(--secondary-color, #3a5a80);
}

.chat-input button:disabled {
  background-color: var(--border-color, #e0e0e0);
  cursor: not-allowed;
}
</style>
