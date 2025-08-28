<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">邮件检测</h1>
        <p class="text-base-content/70">智能识别垃圾邮件，保护您的邮箱安全</p>
      </div>

      <!-- 检测方式选择 -->
      <div class="tabs tabs-boxed mb-6 bg-base-200">
        <a class="tab" :class="{ 'tab-active': activeTab === 'text' }" @click="activeTab = 'text'">文本检测</a>
        <a class="tab" :class="{ 'tab-active': activeTab === 'file' }" @click="activeTab = 'file'">文件上传</a>
        <a class="tab" :class="{ 'tab-active': activeTab === 'batch' }" @click="activeTab = 'batch'">批量检测</a>
      </div>

      <!-- 文本检测 -->
      <div v-if="activeTab === 'text'" class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title mb-4">邮件内容检测</h2>
          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text">邮件主题</span>
              </label>
              <input 
                type="text" 
                class="input input-bordered w-full" 
                placeholder="请输入邮件主题"
                v-model="emailData.subject"
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text">发件人</span>
              </label>
              <input 
                type="email" 
                class="input input-bordered w-full" 
                placeholder="请输入发件人邮箱"
                v-model="emailData.sender"
              />
            </div>
            <div>
              <label class="label">
                <span class="label-text">邮件内容</span>
              </label>
              <textarea 
                class="textarea textarea-bordered w-full" 
                placeholder="请粘贴或输入邮件内容..."
                rows="8"
                v-model="emailData.content"
              ></textarea>
            </div>
            <button class="btn btn-primary w-full" @click="checkEmail" :disabled="isChecking">
              <span v-if="isChecking" class="loading loading-spinner"></span>
              {{ isChecking ? '检测中...' : '开始检测' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 文件上传 -->
      <div v-if="activeTab === 'file'" class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title mb-4">文件上传检测</h2>
          <div class="space-y-4">
            <div class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
              <div class="text-4xl mb-4">📁</div>
              <p class="mb-4">拖拽文件到此处或点击选择文件</p>
              <input 
                type="file" 
                class="file-input file-input-bordered w-full max-w-xs" 
                accept=".eml,.msg,.txt"
                @change="handleFileUpload"
              />
              <p class="text-sm text-base-content/70 mt-2">支持 .eml, .msg, .txt 格式</p>
            </div>
            <div v-if="uploadedFile" class="alert alert-info">
              <span>已选择文件: {{ uploadedFile.name }}</span>
            </div>
            <button class="btn btn-primary w-full" @click="checkFile" :disabled="!uploadedFile || isChecking">
              <span v-if="isChecking" class="loading loading-spinner"></span>
              {{ isChecking ? '检测中...' : '开始检测' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 批量检测 -->
      <div v-if="activeTab === 'batch'" class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title mb-4">批量检测</h2>
          <div class="space-y-4">
            <div class="alert alert-info">
              <span>批量检测功能可以同时处理多个邮件文件，提高检测效率</span>
            </div>
            <div class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
              <div class="text-4xl mb-4">📂</div>
              <p class="mb-4">选择多个邮件文件进行批量检测</p>
              <input 
                type="file" 
                class="file-input file-input-bordered w-full max-w-xs" 
                accept=".eml,.msg,.txt"
                multiple
                @change="handleBatchUpload"
              />
            </div>
            <div v-if="batchFiles.length > 0" class="space-y-2">
              <p class="font-medium">已选择 {{ batchFiles.length }} 个文件:</p>
              <div class="max-h-32 overflow-y-auto">
                <div v-for="(file, index) in batchFiles" :key="index" class="flex items-center justify-between p-2 bg-base-100 rounded">
                  <span class="text-sm">{{ file.name }}</span>
                  <button class="btn btn-ghost btn-xs" @click="removeBatchFile(index)">移除</button>
                </div>
              </div>
            </div>
            <button class="btn btn-primary w-full" @click="checkBatch" :disabled="batchFiles.length === 0 || isChecking">
              <span v-if="isChecking" class="loading loading-spinner"></span>
              {{ isChecking ? '检测中...' : '开始批量检测' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 检测结果 -->
      <div v-if="checkResult" class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title mb-4">检测结果</h2>
          <div class="space-y-4">
            <!-- 结果概览 -->
            <div class="alert" :class="getResultAlertClass(checkResult.isSpam)">
              <div class="flex items-center">
                <div class="text-2xl mr-3">{{ checkResult.isSpam ? '⚠️' : '✅' }}</div>
                <div>
                  <h3 class="font-bold">{{ checkResult.isSpam ? '检测到垃圾邮件' : '邮件安全' }}</h3>
                  <p>置信度: {{ checkResult.confidence }}%</p>
                </div>
              </div>
            </div>

            <!-- 详细分析 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="card bg-base-100">
                <div class="card-body">
                  <h4 class="font-bold mb-2">风险因素</h4>
                  <div class="space-y-2">
                    <div v-for="risk in checkResult.risks" :key="risk.type" class="flex justify-between">
                      <span>{{ risk.name }}</span>
                      <div class="badge" :class="getRiskBadgeClass(risk.level)">{{ risk.level }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card bg-base-100">
                <div class="card-body">
                  <h4 class="font-bold mb-2">建议操作</h4>
                  <div class="space-y-2">
                    <div v-for="suggestion in checkResult.suggestions" :key="suggestion" class="flex items-center">
                      <span class="text-sm">• {{ suggestion }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <button class="btn btn-outline" @click="saveToHistory">保存到历史</button>
              <button class="btn btn-outline" @click="addToFavorites" v-if="!checkResult.isSpam">添加到收藏</button>
              <button class="btn btn-outline" @click="reportFeedback">反馈结果</button>
              <button class="btn btn-ghost" @click="checkResult = null">清除结果</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 当前激活的标签
const activeTab = ref('text')

// 检测状态
const isChecking = ref(false)

// 邮件数据
const emailData = reactive({
  subject: '',
  sender: '',
  content: ''
})

// 上传的文件
const uploadedFile = ref<File | null>(null)
const batchFiles = ref<File[]>([])

// 检测结果
const checkResult = ref<any>(null)

// 文件上传处理
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0]
  }
}

// 批量文件上传处理
const handleBatchUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    batchFiles.value = Array.from(target.files)
  }
}

// 移除批量文件
const removeBatchFile = (index: number) => {
  batchFiles.value.splice(index, 1)
}

// 邮件检测
const checkEmail = async () => {
  if (!emailData.content.trim()) {
    alert('请输入邮件内容')
    return
  }
  
  isChecking.value = true
  
  // 模拟API调用
  setTimeout(() => {
    checkResult.value = {
      isSpam: Math.random() > 0.7,
      confidence: Math.floor(Math.random() * 30) + 70,
      risks: [
        { type: 'sender', name: '发件人信誉', level: '低' },
        { type: 'content', name: '内容分析', level: '中' },
        { type: 'links', name: '链接检查', level: '高' }
      ],
      suggestions: [
        '建议验证发件人身份',
        '谨慎点击邮件中的链接',
        '不要下载未知附件'
      ]
    }
    isChecking.value = false
  }, 2000)
}

// 文件检测
const checkFile = async () => {
  if (!uploadedFile.value) {
    alert('请选择文件')
    return
  }
  
  isChecking.value = true
  
  // 模拟API调用
  setTimeout(() => {
    checkResult.value = {
      isSpam: Math.random() > 0.6,
      confidence: Math.floor(Math.random() * 40) + 60,
      risks: [
        { type: 'file', name: '文件格式', level: '低' },
        { type: 'content', name: '内容分析', level: '中' }
      ],
      suggestions: [
        '文件检测完成',
        '建议定期更新病毒库'
      ]
    }
    isChecking.value = false
  }, 3000)
}

// 批量检测
const checkBatch = async () => {
  if (batchFiles.value.length === 0) {
    alert('请选择文件')
    return
  }
  
  isChecking.value = true
  
  // 模拟API调用
  setTimeout(() => {
    checkResult.value = {
      isSpam: false,
      confidence: 85,
      risks: [
        { type: 'batch', name: '批量处理', level: '低' }
      ],
      suggestions: [
        `成功处理 ${batchFiles.value.length} 个文件`,
        '所有文件检测完成'
      ]
    }
    isChecking.value = false
  }, 4000)
}

// 获取结果警告样式
const getResultAlertClass = (isSpam: boolean) => {
  return isSpam ? 'alert-error' : 'alert-success'
}

// 获取风险徽章样式
const getRiskBadgeClass = (level: string) => {
  switch (level) {
    case '高': return 'badge-error'
    case '中': return 'badge-warning'
    case '低': return 'badge-success'
    default: return 'badge-info'
  }
}

// 保存到历史
const saveToHistory = () => {
  alert('已保存到历史记录')
}

// 添加到收藏
const addToFavorites = () => {
  alert('已添加到收藏')
}

// 反馈结果
const reportFeedback = () => {
  alert('感谢您的反馈')
}
</script>

<style scoped>
.tab-active {
  @apply bg-primary text-primary-content;
}
</style>
