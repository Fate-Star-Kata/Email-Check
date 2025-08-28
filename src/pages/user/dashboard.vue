<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">欢迎回来！</h1>
        <p class="text-base-content/70">您的邮件安全防护中心</p>
      </div>

      <!-- 快速统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <div class="flex items-center">
              <div class="text-3xl mr-4">📧</div>
              <div>
                <h3 class="text-2xl font-bold">{{ stats.totalChecks }}</h3>
                <p class="text-base-content/70">总检测次数</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <div class="flex items-center">
              <div class="text-3xl mr-4">🛡️</div>
              <div>
                <h3 class="text-2xl font-bold text-error">{{ stats.spamBlocked }}</h3>
                <p class="text-base-content/70">拦截垃圾邮件</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <div class="flex items-center">
              <div class="text-3xl mr-4">⭐</div>
              <div>
                <h3 class="text-2xl font-bold text-warning">{{ stats.favorites }}</h3>
                <p class="text-base-content/70">收藏邮件</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 快速检测 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">快速检测</h2>
            <div class="space-y-4">
              <textarea 
                class="textarea textarea-bordered w-full" 
                placeholder="粘贴邮件内容进行快速检测..."
                rows="4"
                v-model="quickCheckContent"
              ></textarea>
              <button class="btn btn-primary w-full" @click="quickCheck">立即检测</button>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">最近活动</h2>
            <div class="space-y-3">
              <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-3" :class="getActivityColor(activity.type)"></div>
                  <div>
                    <p class="font-medium">{{ activity.title }}</p>
                    <p class="text-sm text-base-content/70">{{ activity.time }}</p>
                  </div>
                </div>
                <div class="badge" :class="getActivityBadge(activity.type)">{{ activity.result }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-4">系统状态</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl mb-2">🟢</div>
              <p class="font-medium">AI引擎</p>
              <p class="text-sm text-success">正常运行</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">🟢</div>
              <p class="font-medium">数据库</p>
              <p class="text-sm text-success">连接正常</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">🟢</div>
              <p class="font-medium">邮件服务</p>
              <p class="text-sm text-success">服务可用</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">🟡</div>
              <p class="font-medium">更新检查</p>
              <p class="text-sm text-warning">有新版本</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 统计数据
const stats = reactive({
  totalChecks: 1234,
  spamBlocked: 89,
  favorites: 23
})

// 快速检测内容
const quickCheckContent = ref('')

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '检测可疑邮件',
    time: '2分钟前',
    type: 'spam',
    result: '垃圾邮件'
  },
  {
    id: 2,
    title: '检测工作邮件',
    time: '15分钟前',
    type: 'safe',
    result: '安全邮件'
  },
  {
    id: 3,
    title: '添加邮件收藏',
    time: '1小时前',
    type: 'favorite',
    result: '已收藏'
  },
  {
    id: 4,
    title: '检测营销邮件',
    time: '2小时前',
    type: 'spam',
    result: '垃圾邮件'
  }
])

// 快速检测功能
const quickCheck = () => {
  if (!quickCheckContent.value.trim()) {
    alert('请输入邮件内容')
    return
  }
  // 这里可以调用检测API
  alert('检测功能开发中...')
}

// 获取活动颜色
const getActivityColor = (type: string) => {
  switch (type) {
    case 'spam': return 'bg-error'
    case 'safe': return 'bg-success'
    case 'favorite': return 'bg-warning'
    default: return 'bg-info'
  }
}

// 获取活动徽章样式
const getActivityBadge = (type: string) => {
  switch (type) {
    case 'spam': return 'badge-error'
    case 'safe': return 'badge-success'
    case 'favorite': return 'badge-warning'
    default: return 'badge-info'
  }
}
</script>

<style scoped>
.active {
  @apply bg-primary text-primary-content;
}
</style>