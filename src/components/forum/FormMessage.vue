<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import auth from '/user/jhd.jpg'
// Message types
type MessageType = 'companion' | 'review'
type Tab = 'all' | MessageType

// Define message interfaces
interface Author {
  name: string
  avatar: string
}

interface Comment {
  content: string
  author: Author
  createdAt: string
}

interface Message {
  _id: string
  type: MessageType
  title: string
  content: string
  location: string
  startDate?: string
  endDate?: string
  rating?: number
  author: Author
  createdAt: string
  likes: number
  comments: Comment[]
}

// State management
const activeTab = ref<Tab>('all')
const messages = ref<Message[]>([])
const isLoading = ref(true)
const error = ref('')
const selectedMessage = ref<Message | null>(null)

// New message form
const showForm = ref(false)
const newMessage = ref<Omit<Message, '_id' | 'createdAt' | 'likes' | 'comments'>>({
  type: 'companion',
  title: '',
  content: '',
  location: '',
  startDate: '',
  endDate: '',
  rating: 5,
  tags: [],
  author: {
    name: 'Current User', // This would come from auth system
    avatar: auth, // Default avatar
  },
})

// Comment state
const newComment = ref('')
const commentError = ref('')

// Fetch messages from API
const fetchMessages = async (type?: MessageType) => {
  try {
    isLoading.value = true
    error.value = ''

    let url = '/api/messages'
    if (type) url += `?type=${type}`

    const response = await axios.get(url)
    messages.value = response.data
  } catch (err) {
    error.value = '加载留言失败，请重试。'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Filter messages based on active tab
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') return messages.value
  return messages.value.filter((msg) => msg.type === activeTab.value)
})

// Change active tab
const changeTab = (tab: Tab) => {
  activeTab.value = tab
  selectedMessage.value = null
  if (tab !== 'all') {
    fetchMessages(tab as MessageType)
  } else {
    fetchMessages()
  }
}

// Submit new message
const submitMessage = async () => {
  try {
    // Validate form fields
    if (!newMessage.value.title.trim()) {
      return alert('请输入标题')
    }
    if (!newMessage.value.content.trim()) {
      return alert('请输入内容')
    }
    if (!newMessage.value.location.trim()) {
      return alert('请输入地点')
    }

    if (newMessage.value.type === 'companion') {
      if (!newMessage.value.startDate) {
        return alert('请选择开始日期')
      }
      if (!newMessage.value.endDate) {
        return alert('请选择结束日期')
      }
    }

    // Submit the form
    const response = await axios.post('/api/messages', newMessage.value)

    // Add the new message to the list and reset form
    messages.value.unshift(response.data)
    resetForm()
    showForm.value = false
  } catch (err) {
    alert('提交失败，请重试')
    console.error(err)
  }
}

// Reset the form
const resetForm = () => {
  newMessage.value = {
    type: 'companion',
    title: '',
    content: '',
    location: '',
    startDate: '',
    endDate: '',
    rating: 5,
    tags: [],
    author: {
      name: 'Current User',
      avatar: auth,
    },
  }
}

// Like a message
const likeMessage = async (messageId: string, event: Event) => {
  event.stopPropagation()
  try {
    const response = await axios.post(`/api/messages/${messageId}/like`)

    // Update the message in the list
    const index = messages.value.findIndex((msg) => msg._id === messageId)
    if (index !== -1) {
      messages.value[index] = response.data

      // Update selected message if it's open
      if (selectedMessage.value && selectedMessage.value._id === messageId) {
        selectedMessage.value = response.data
      }
    }
  } catch (err) {
    console.error(err)
  }
}

// Open message detail view
const openMessageDetail = (message: Message) => {
  selectedMessage.value = message
}

// Close message detail view
const closeMessageDetail = () => {
  selectedMessage.value = null
}

// Submit a comment
const submitComment = async () => {
  if (!newComment.value.trim()) {
    commentError.value = '请输入评论内容'
    return
  }

  if (!selectedMessage.value) {
    return
  }

  try {
    const comment = {
      content: newComment.value,
      author: {
        name: 'Current User',
        avatar: auth,
      },
    }

    const response = await axios.post(
      `/api/messages/${selectedMessage.value._id}/comments`,
      comment,
    )

    // Update the selected message with the new comment
    selectedMessage.value = response.data

    // Also update in the messages list
    const index = messages.value.findIndex((msg) => msg._id === selectedMessage.value._id)
    if (index !== -1) {
      messages.value[index] = response.data
    }

    // Reset comment form
    newComment.value = ''
    commentError.value = ''
  } catch (err) {
    commentError.value = '评论提交失败，请重试'
    console.error(err)
  }
}

// Format date for display
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
}

// Get background color for card
const getCardColor = (index: number, type: MessageType): string => {
  if (type === 'companion') {
    const colors = ['#ffb6c1', '#ffd8b1', '#fffacd', '#98fb98']
    return colors[index % colors.length]
  } else {
    const colors = ['#add8e6', '#e6e6fa', '#afeeee', '#b0e0e6']
    return colors[index % colors.length]
  }
}

// Load initial data
onMounted(() => {
  fetchMessages()
})

// Dummy data for testing
const mockMessages: Message[] = [
  {
    _id: '1',
    type: 'companion',
    title: '寻找一起去云南的伙伴',
    content:
      '这是一段很长的时光，它或许不长，但是它是我们现在最真挚的时光。就在这里和大家分享一下我的旅行计划吧。',
    location: '云南',
    startDate: '2022-08-23',
    endDate: '2022-08-30',
    author: {
      name: '热爱旅行的人',
      avatar: '/default-avatar.png',
    },
    createdAt: '2022-08-23',
    likes: 12,
    comments: [
      {
        content: '我感兴趣，可以联系我',
        author: {
          name: '旅行者',
          avatar: '/default-avatar.png',
        },
        createdAt: '2022-08-24',
      },
    ],
  },
  {
    _id: '2',
    type: 'review',
    title: '黄山游记分享',
    content:
      '这是一段很长的时光，它或许不长，但是它是我们现在最真挚的时光。就在这里和大家分享一下我的旅行体验吧。',
    location: '黄山',
    rating: 5,
    author: {
      name: '热爱旅行的人',
      avatar: '/default-avatar.png',
    },
    createdAt: '2022-08-23',
    likes: 12,
    comments: [
      {
        content: '照片拍得真美',
        author: {
          name: '旅行者',
          avatar: '/default-avatar.png',
        },
        createdAt: '2022-08-24',
      },
    ],
  },
]

// Use mock data if API fails
if (messages.value.length === 0) {
  messages.value = mockMessages
}
</script>

<template>
  <button
    class="btn btn-circle btn-primary fixed top-48 right-8 shadow-lg z-50"
    @click="showForm = true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-2">留言墙</h1>
    <p class="text-center text-gray-600 mb-8">请多留言，当然也留下你的信息。</p>

    <div class="tabs tabs-boxed justify-center mb-8">
      <button :class="['tab', activeTab === 'all' ? 'tab-active' : '']" @click="changeTab('all')">
        全部
      </button>
      <button
        :class="['tab', activeTab === 'companion' ? 'tab-active' : '']"
        @click="changeTab('companion')"
      >
        寻找旅伴
      </button>
      <button
        :class="['tab', activeTab === 'review' ? 'tab-active' : '']"
        @click="changeTab('review')"
      >
        景点评价
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="mt-4 text-gray-600">加载中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error max-w-md mx-auto my-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 class="font-bold">出错了!</h3>
        <div class="text-sm">{{ error }}</div>
      </div>
      <button class="btn btn-sm" @click="fetchMessages()">重试</button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredMessages.length === 0"
      class="flex flex-col items-center justify-center py-12"
    >
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="text-gray-600 mb-4">暂无留言</p>
        <button class="btn btn-primary" @click="showForm = true">发布第一条留言</button>
      </div>
    </div>

    <!-- Grid Layout for Messages -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(message, index) in filteredMessages"
        :key="message._id"
        class="card shadow-lg cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
        :class="message.type === 'companion' ? 'bg-pink-50' : 'bg-blue-50'"
        @click="openMessageDetail(message)"
      >
        <div class="card-body p-5">
          <div class="flex justify-between items-start mb-2">
            <div
              class="badge"
              :class="message.type === 'companion' ? 'badge-primary' : 'badge-secondary'"
            >
              {{ message.type === 'companion' ? '寻找旅伴' : '景点评价' }}
            </div>
            <div class="text-sm text-gray-500">{{ formatDate(message.createdAt) }}</div>
          </div>

          <h3 class="card-title text-lg font-bold mb-2">{{ message.title }}</h3>

          <div class="flex items-center text-sm text-gray-600 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ message.location }}
          </div>

          <div
            v-if="message.type === 'companion'"
            class="flex items-center text-sm text-gray-600 mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formatDate(message.startDate) }} - {{ formatDate(message.endDate) }}
          </div>

          <div v-if="message.type === 'review'" class="rating mb-2">
            <input
              v-for="star in 5"
              :key="star"
              type="radio"
              :name="`rating-${message._id}`"
              class="mask mask-star-2 bg-orange-400"
              :checked="star === (message.rating || 0)"
              disabled
            />
          </div>

          <p class="text-gray-700 mb-4 line-clamp-3">{{ message.content }}</p>

          <div class="card-actions justify-between items-center mt-auto">
            <div class="text-sm font-medium">{{ message.author.name }}</div>
            <div class="flex gap-3">
              <button class="btn btn-sm btn-ghost" @click="likeMessage(message._id, $event)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="message.likes > 0 ? 'fill-red-500' : 'fill-none stroke-current'"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {{ message.likes }}
              </button>
              <button class="btn btn-sm btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {{ message.comments?.length || 0 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <div v-if="selectedMessage" class="modal modal-open">
      <div
        class="modal-box max-w-3xl"
        :class="selectedMessage.type === 'companion' ? 'bg-pink-50' : 'bg-blue-50'"
      >
        <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="closeMessageDetail">
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

        <div class="mb-6">
          <div
            class="badge mb-2"
            :class="selectedMessage.type === 'companion' ? 'badge-primary' : 'badge-secondary'"
          >
            {{ selectedMessage.type === 'companion' ? '寻找旅伴' : '景点评价' }}
          </div>
          <h2 class="text-2xl font-bold mb-3">{{ selectedMessage.title }}</h2>
          <div class="space-y-2">
            <div class="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ selectedMessage.location }}
            </div>
            <div
              v-if="selectedMessage.type === 'companion'"
              class="flex items-center text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDate(selectedMessage.startDate) }} -
              {{ formatDate(selectedMessage.endDate) }}
            </div>
            <div v-if="selectedMessage.type === 'review'" class="rating">
              <input
                v-for="star in 5"
                :key="star"
                type="radio"
                :name="`rating-detail-${selectedMessage._id}`"
                class="mask mask-star-2 bg-orange-400"
                :checked="star === (selectedMessage.rating || 0)"
                disabled
              />
            </div>
          </div>
        </div>

        <div class="flex items-center mb-4">
          <div class="avatar mr-3">
            <div class="w-10 rounded-full">
              <img :src="selectedMessage.author.avatar" alt="Avatar" />
            </div>
          </div>
          <div>
            <div class="font-medium">{{ selectedMessage.author.name }}</div>
            <div class="text-sm text-gray-500">{{ formatDate(selectedMessage.createdAt) }}</div>
          </div>
        </div>

        <div class="prose max-w-none mb-6 p-4 bg-white bg-opacity-50 rounded-lg">
          {{ selectedMessage.content }}
        </div>

        <div class="flex gap-4 mb-6">
          <button class="btn btn-outline gap-2" @click="likeMessage(selectedMessage._id, $event)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              :class="selectedMessage.likes > 0 ? 'fill-red-500' : 'fill-none stroke-current'"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {{ selectedMessage.likes || 0 }} 喜欢
          </button>
          <button class="btn btn-outline gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {{ selectedMessage.comments?.length || 0 }} 评论
          </button>
        </div>

        <div class="divider">评论区</div>

        <div
          v-if="selectedMessage.comments && selectedMessage.comments.length > 0"
          class="space-y-4 mb-6"
        >
          <div
            v-for="(comment, index) in selectedMessage.comments"
            :key="index"
            class="bg-white bg-opacity-70 p-4 rounded-lg"
          >
            <div class="flex items-center mb-2">
              <div class="avatar mr-3">
                <div class="w-8 rounded-full">
                  <img :src="comment.author.avatar" alt="Avatar" />
                </div>
              </div>
              <div>
                <div class="font-medium">{{ comment.author.name }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</div>
              </div>
            </div>
            <p class="text-gray-700">{{ comment.content }}</p>
          </div>
        </div>

        <div v-else class="alert mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-info shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>暂无评论，快来发表第一条评论吧</span>
        </div>

        <div>
          <textarea
            v-model="newComment"
            placeholder="添加评论..."
            class="textarea textarea-bordered w-full mb-2"
            rows="3"
          ></textarea>

          <div v-if="commentError" class="alert alert-error mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ commentError }}</span>
          </div>

          <button class="btn btn-primary w-full" @click="submitComment">发表评论</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeMessageDetail"></div>
    </div>

    <!-- New Message Form Modal -->
    <div v-if="showForm" class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <button class="btn btn-sm btn-circle absolute right-2 top-2" @click="showForm = false">
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

        <h3 class="font-bold text-lg mb-4">发布新留言</h3>

        <div class="tabs tabs-boxed mb-6">
          <button
            :class="['tab', newMessage.type === 'companion' ? 'tab-active' : '']"
            @click="newMessage.type = 'companion'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            寻找旅伴
          </button>
          <button
            :class="['tab', newMessage.type === 'review' ? 'tab-active' : '']"
            @click="newMessage.type = 'review'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            景点评价
          </button>
        </div>

        <div class="space-y-4">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">标题</span>
            </label>
            <input
              type="text"
              v-model="newMessage.title"
              placeholder="输入留言标题"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">地点</span>
            </label>
            <input
              type="text"
              v-model="newMessage.location"
              placeholder="输入目的地或景点名称"
              class="input input-bordered w-full"
            />
          </div>

          <div v-if="newMessage.type === 'companion'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">开始日期</span>
              </label>
              <input
                type="date"
                v-model="newMessage.startDate"
                class="input input-bordered w-full"
              />
            </div>
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">结束日期</span>
              </label>
              <input type="date" v-model="newMessage.endDate" class="input input-bordered w-full" />
            </div>
          </div>

          <div v-if="newMessage.type === 'review'" class="form-control">
            <label class="label">
              <span class="label-text">评分</span>
            </label>
            <div class="rating rating-lg">
              <input
                v-for="star in 5"
                :key="star"
                type="radio"
                :name="'rating-create'"
                class="mask mask-star-2 bg-orange-400"
                :checked="star === newMessage.rating"
                @click="newMessage.rating = star"
              />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">内容</span>
            </label>
            <textarea
              v-model="newMessage.content"
              placeholder="分享你的想法..."
              class="textarea textarea-bordered w-full"
              rows="4"
            ></textarea>
          </div>

          <div class="modal-action">
            <button class="btn btn-ghost" @click="showForm = false">取消</button>
            <button class="btn btn-primary" @click="submitMessage">发布</button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop" @click="showForm = false"></div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>
