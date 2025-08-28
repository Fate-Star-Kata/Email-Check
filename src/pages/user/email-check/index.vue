<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">邮件检测</h1>
        <p class="text-base-content/70">智能识别垃圾邮件，保护您的邮箱安全</p>
      </div>

      <!-- 文本检测 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <h2 class="card-title mb-4">邮件内容检测</h2>
          <div class="space-y-4">
            <div>
              <label class="label">
                <span class="label-text">邮件主题（必填）</span>
              </label>
              <input type="text" class="input input-bordered w-full" placeholder="请输入邮件主题（必填）"
                v-model="emailData.subject" />
            </div>
            <div>
              <label class="label">
                <span class="label-text">发件人（必填）</span>
              </label>
              <input type="email" class="input input-bordered w-full" placeholder="请输入发件人邮箱（必填）"
                v-model="emailData.sender" />
            </div>
            <div>
              <label class="label">
                <span class="label-text">邮件内容（必填）</span>
              </label>
              <textarea class="textarea textarea-bordered w-full" placeholder="请粘贴或输入邮件内容（必填）..." rows="8"
                v-model="emailData.content"></textarea>
            </div>
            <button class="btn btn-primary w-full" @click="checkEmail"
              :disabled="isChecking || !emailData.subject.trim() || !emailData.sender.trim() || !emailData.content.trim()">
              <span v-if="isChecking" class="loading loading-spinner"></span>
              {{ isChecking ? '检测中...' : '开始检测' }}
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
import { detectEmailText } from '@/api/pagesApi/email-check'
import type { EmailDetectionRequest } from '@/types/apis/pageApis_T'

// 检测状态
const isChecking = ref(false)

// 邮件数据
const emailData = reactive({
  subject: '',
  sender: '',
  content: ''
})

// 检测结果
const checkResult = ref<any>(null)



// 邮箱格式验证
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 邮件检测
const checkEmail = async () => {
  // 验证必填字段
  if (!emailData.subject.trim()) {
    alert('请输入邮件主题')
    return
  }

  if (!emailData.sender.trim()) {
    alert('请输入发件人邮箱')
    return
  }

  if (!validateEmail(emailData.sender)) {
    alert('请输入有效的邮箱格式')
    return
  }

  if (!emailData.content.trim()) {
    alert('请输入邮件内容')
    return
  }

  isChecking.value = true

  try {
    const requestData: EmailDetectionRequest = {
      email_subject: emailData.subject,
      email_sender: emailData.sender,
      email_content: emailData.content
    }

    const response = await detectEmailText(requestData)

    if (response.code === 200 && response.data) {
      const result = response.data
      checkResult.value = {
        isSpam: result.result === 'spam',
        confidence: Math.round(result.confidence * 100),
        risks: [
          { type: 'sender', name: '发件人信誉', level: result.confidence > 0.8 ? '高' : result.confidence > 0.5 ? '中' : '低' },
          { type: 'content', name: '内容分析', level: result.result === 'spam' ? '高' : '低' }
        ],
        suggestions: result.result === 'spam' ? [
          '该邮件被识别为垃圾邮件',
          '建议谨慎处理此邮件',
          '不要点击邮件中的可疑链接'
        ] : [
          '该邮件被识别为正常邮件',
          '邮件内容看起来安全'
        ]
      }
    } else {
      alert('检测失败，请稍后重试')
    }
  } catch (error) {
    console.error('邮件检测失败:', error)
    alert('检测失败，请稍后重试')
  } finally {
    isChecking.value = false
  }
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

<style scoped></style>
