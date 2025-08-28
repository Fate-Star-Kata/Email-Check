<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">邮件检查</h1>
        <p class="text-base-content/70">使用AI深度学习技术检测邮件是否为垃圾邮件</p>
      </div>

      <!-- 检查容器 -->
      <div class="card bg-base-200 shadow-sm mb-8">
        <div class="card-body">
          <!-- 输入方式选择 -->
          <div class="tabs tabs-boxed mb-6">
            <a 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'text' }"
              @click="activeTab = 'text'"
            >
              文本输入
            </a>
            <a 
              class="tab" 
              :class="{ 'tab-active': activeTab === 'file' }"
              @click="activeTab = 'file'"
            >
              文件上传
            </a>
          </div>

          <!-- 文本输入模式 -->
          <div v-if="activeTab === 'text'" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">邮件主题</span>
              </label>
              <input 
                type="text" 
                placeholder="请输入邮件主题" 
                class="input input-bordered w-full"
                v-model="emailData.subject"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">发件人</span>
              </label>
              <input 
                type="email" 
                placeholder="请输入发件人邮箱" 
                class="input input-bordered w-full"
                v-model="emailData.sender"
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">邮件内容</span>
              </label>
              <textarea 
                class="textarea textarea-bordered w-full" 
                rows="10" 
                placeholder="请粘贴邮件内容..."
                v-model="emailData.content"
              ></textarea>
            </div>
          </div>

          <!-- 文件上传模式 -->
          <div v-if="activeTab === 'file'" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">选择邮件文件</span>
              </label>
              <input 
                type="file" 
                class="file-input file-input-bordered w-full" 
                accept=".eml,.msg,.txt"
                @change="handleFileUpload"
              />
              <label class="label">
                <span class="label-text-alt">支持格式：.eml, .msg, .txt</span>
              </label>
            </div>
            
            <div v-if="uploadedFile" class="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>已选择文件：{{ uploadedFile.name }}</span>
            </div>
          </div>

          <!-- 检测按钮 -->
          <div class="card-actions justify-center mt-6">
            <button 
              class="btn btn-primary btn-lg" 
              :class="{ 'loading': isChecking }"
              @click="checkEmail"
              :disabled="isChecking || !canCheck"
            >
              {{ isChecking ? '检测中...' : '开始检测' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 检测结果 -->
      <div v-if="checkResult" class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-4">检测结果</h2>
          
          <!-- 结果概览 -->
          <div class="alert" :class="getResultAlertClass(checkResult.type)">
            <div class="flex items-center">
              <div class="text-2xl mr-4">{{ getResultIcon(checkResult.type) }}</div>
              <div>
                <h3 class="font-bold text-lg">{{ checkResult.title }}</h3>
                <p>{{ checkResult.description }}</p>
              </div>
            </div>
          </div>

          <!-- 详细分析 -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">详细分析</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="stat bg-base-100 rounded-lg">
                <div class="stat-title">垃圾邮件概率</div>
                <div class="stat-value" :class="getProbabilityColor(checkResult.spamProbability)">{{ checkResult.spamProbability }}%</div>
                <div class="stat-desc">基于AI模型分析</div>
              </div>
              
              <div class="stat bg-base-100 rounded-lg">
                <div class="stat-title">风险等级</div>
                <div class="stat-value" :class="getRiskColor(checkResult.riskLevel)">{{ checkResult.riskLevel }}</div>
                <div class="stat-desc">综合评估结果</div>
              </div>
            </div>
          </div>

          <!-- 检测特征 -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">检测特征</h3>
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="feature in checkResult.features" 
                :key="feature.name"
                class="badge" 
                :class="getFeatureBadgeClass(feature.type)"
              >
                {{ feature.name }}: {{ feature.value }}
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end mt-6">
            <button class="btn btn-outline" @click="addToFavorites">添加收藏</button>
            <button class="btn btn-primary" @click="saveToHistory">保存到历史</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 活动标签
const activeTab = ref('text')

// 邮件数据
const emailData = ref({
  subject: '',
  sender: '',
  content: ''
})

// 上传文件
const uploadedFile = ref<File | null>(null)

// 检测状态
const isChecking = ref(false)

// 检测结果
const checkResult = ref<any>(null)

// 是否可以检测
const canCheck = computed(() => {
  if (activeTab.value === 'text') {
    return emailData.value.content.trim().length > 0
  } else {
    return uploadedFile.value !== null
  }
})

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0]
  }
}

// 检测邮件
const checkEmail = async () => {
  isChecking.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟检测结果
    const spamProbability = Math.floor(Math.random() * 100)
    const isSpam = spamProbability > 70
    
    checkResult.value = {
      type: isSpam ? 'spam' : 'safe',
      title: isSpam ? '检测到垃圾邮件' : '邮件安全',
      description: isSpam ? '该邮件被识别为垃圾邮件，建议谨慎处理' : '该邮件通过安全检测，可以正常查看',
      spamProbability,
      riskLevel: isSpam ? '高风险' : '低风险',
      features: [
        { name: '关键词匹配', value: isSpam ? '发现可疑词汇' : '正常', type: isSpam ? 'warning' : 'success' },
        { name: '发件人信誉', value: isSpam ? '低信誉' : '高信誉', type: isSpam ? 'error' : 'success' },
        { name: '链接检测', value: isSpam ? '包含可疑链接' : '安全', type: isSpam ? 'warning' : 'success' },
        { name: '附件扫描', value: '无附件', type: 'info' }
      ]
    }
    
    isChecking.value = false
  }, 2000)
}

// 获取结果警告样式
const getResultAlertClass = (type: string) => {
  switch (type) {
    case 'spam': return 'alert-error'
    case 'safe': return 'alert-success'
    default: return 'alert-info'
  }
}

// 获取结果图标
const getResultIcon = (type: string) => {
  switch (type) {
    case 'spam': return '⚠️'
    case 'safe': return '✅'
    default: return 'ℹ️'
  }
}

// 获取概率颜色
const getProbabilityColor = (probability: number) => {
  if (probability > 70) return 'text-error'
  if (probability > 30) return 'text-warning'
  return 'text-success'
}

// 获取风险颜色
const getRiskColor = (level: string) => {
  switch (level) {
    case '高风险': return 'text-error'
    case '中风险': return 'text-warning'
    case '低风险': return 'text-success'
    default: return 'text-info'
  }
}

// 获取特征徽章样式
const getFeatureBadgeClass = (type: string) => {
  switch (type) {
    case 'error': return 'badge-error'
    case 'warning': return 'badge-warning'
    case 'success': return 'badge-success'
    default: return 'badge-info'
  }
}

// 添加到收藏
const addToFavorites = () => {
  alert('添加收藏功能开发中...')
}

// 保存到历史
const saveToHistory = () => {
  alert('保存到历史功能开发中...')
}
</script>

<style scoped>
.active {
  @apply bg-primary text-primary-content;
}
</style>