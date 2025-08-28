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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <div class="flex items-center">
              <div class="text-3xl mr-4">📧</div>
              <div>
                <h3 class="text-2xl font-bold">{{ loading ? '-' : stats.totalChecks }}</h3>
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
                <h3 class="text-2xl font-bold text-error">{{ loading ? '-' : stats.spamBlocked }}</h3>
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
                <h3 class="text-2xl font-bold text-warning">{{ loading ? '-' : stats.favorites }}</h3>
                <p class="text-base-content/70">收藏邮件</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <div class="flex items-center">
              <div class="text-3xl mr-4">🎯</div>
              <div>
                <h3 class="text-2xl font-bold text-success">{{ loading ? '-' : formatAccuracyRate(stats.accuracyRate)
                }}%</h3>
                <p class="text-base-content/70">准确率</p>
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
              <input type="text" class="input input-bordered w-full" placeholder="邮件主题（必填）"
                v-model="quickCheckData.email_subject" :disabled="loading" />
              <input type="email" class="input input-bordered w-full" placeholder="发件人邮箱（必填）"
                v-model="quickCheckData.email_sender" :disabled="loading" />
              <textarea class="textarea textarea-bordered w-full" placeholder="粘贴邮件内容进行快速检测..." rows="4"
                v-model="quickCheckData.email_content" :disabled="loading"></textarea>
              <button class="btn btn-primary w-full" @click="quickCheck"
                :disabled="loading || !quickCheckData.email_content.trim() || !quickCheckData.email_sender.trim() || !quickCheckData.email_subject.trim()"
                :class="{ 'loading': loading }">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                {{ loading ? '检测中...' : '立即检测' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4">最近活动</h2>
            <div class="space-y-4">
              <div v-if="loading" class="text-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
                <p class="mt-2 text-base-content/70">加载中...</p>
              </div>
              <div v-else-if="recentActivities.length === 0" class="text-center py-8">
                <p class="text-base-content/70">暂无检测记录</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="activity in recentActivities" :key="activity.id"
                  class="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div class="flex items-center">
                    <div class="text-2xl mr-3">📧</div>
                    <div>
                      <p class="font-medium">{{ activity.sender }}</p>
                      <p class="text-sm text-base-content/70">{{ activity.email_subject || '无主题' }}</p>
                      <p class="text-xs text-base-content/50">置信度: {{ (activity.confidence * 100).toFixed(1) }}%</p>
                    </div>
                  </div>
                  <div class="badge" :class="activity.detection_result == 'spam' ? 'badge-error' : 'badge-success'">
                    {{ activity.detection_result == 'spam' ? '垃圾邮件' : '正常邮件' }}
                  </div>
                </div>
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
import { ref, reactive, onMounted } from 'vue'
import { getUserDashboard, quickEmailDetection } from '@/api/pagesApi/dashboard'
import type { UserDashboardData } from '@/types/apis/pageApis_T'
import { ElMessage } from 'element-plus'

// 统计数据
const stats = reactive({
  totalChecks: 0,
  spamBlocked: 0,
  favorites: 0,
  accuracyRate: 0
})

// 快速检测数据
const quickCheckData = reactive({
  email_content: '',
  email_sender: '',
  email_subject: ''
})

// 最近活动
const recentActivities = ref<{
  id: number
  title: string
  email_subject: string
  type: string
  result: string
  sender?: string
  confidence: number
  detection_result?: string
}[]>([])

// 加载状态
const loading = ref(false)

// 获取仪表板数据
const fetchDashboardData = async () => {
  try {
    loading.value = true
    const response = await getUserDashboard()

    if (response.code === 200 && response.data) {
      const data = response.data

      // 更新统计数据
      stats.totalChecks = data.total_checks
      stats.spamBlocked = data.spam_blocked
      stats.favorites = data.favorite_emails
      stats.accuracyRate = data.accuracy_rate

      // 更新最近活动
      recentActivities.value = data.recent_detections.map(detection => ({
        id: detection.id,
        title: detection.email_subject || '邮件检测',
        email_subject: detection.email_subject || '无主题',
        type: detection.detection_result === 'spam' ? 'spam' : 'safe',
        result: detection.detection_result === 'spam' ? '垃圾邮件' : '正常邮件',
        sender: detection.email_sender,
        confidence: detection.confidence_score,
        detection_result: detection.detection_result
      }))
    }
  } catch (error) {
    console.error('获取仪表板数据失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 邮箱格式验证
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 快速检测功能
const quickCheck = async () => {
  // 验证邮件主题
  if (!quickCheckData.email_subject.trim()) {
    ElMessage.warning('请输入邮件主题')
    return
  }

  // 验证发件人邮箱
  if (!quickCheckData.email_sender.trim()) {
    ElMessage.warning('请输入发件人邮箱')
    return
  }

  if (!validateEmail(quickCheckData.email_sender.trim())) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  // 验证邮件内容
  if (!quickCheckData.email_content.trim()) {
    ElMessage.warning('请输入邮件内容')
    return
  }

  try {
    loading.value = true

    // 构建请求参数，所有字段都是必须的
    const requestData = {
      email_content: quickCheckData.email_content.trim(),
      email_sender: quickCheckData.email_sender.trim(),
      email_subject: quickCheckData.email_subject.trim()
    }

    const response = await quickEmailDetection(requestData)

    if (response.code === 200 && response.data) {
      const result = response.data.result === 'spam' ? '垃圾邮件' : '正常邮件'
      const confidence = Math.round(response.data.confidence * 100)

      // 显示风险因素（如果有）
      let message = `检测完成：${result}（置信度：${confidence}%）`
      if (response.data.risk_factors && response.data.risk_factors.length > 0) {
        message += `\n风险因素：${response.data.risk_factors.join('、')}`
      }

      ElMessage.success(message)

      // 清空输入框
      quickCheckData.email_content = ''
      quickCheckData.email_sender = ''
      quickCheckData.email_subject = ''

      // 刷新数据
      await fetchDashboardData()
    }
  } catch (error) {
    console.error('快速检测失败:', error)
    ElMessage.error('检测失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 格式化时间
const formatTime = (dateString: string) => {
  if (!dateString) return '未知时间'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '时间格式错误'

  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  return date.toLocaleDateString('zh-CN')
}

// 格式化准确率
const formatAccuracyRate = (rate: number) => {
  if (typeof rate !== 'number' || isNaN(rate)) return '0.0'

  // 如果已经是百分比形式（大于1），直接使用
  if (rate > 1) {
    return Math.min(rate, 100).toFixed(1)
  }

  // 如果是小数形式（0-1之间），转换为百分比
  return (rate * 100).toFixed(1)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchDashboardData()
})

// 移除了不再使用的 getActivityColor 和 getActivityBadge 方法
</script>

<style scoped>
.active {
  @apply bg-primary text-primary-content;
}
</style>
