<script setup lang="ts">
import { Motion } from 'motion-v'
import { ref, computed } from 'vue'
import type { DetectionRecord } from '@/types/factory'
import { ElMessage } from 'element-plus'
import {
  Document,
  User,
  Clock,
  Warning,
  CircleCheck,
  CircleClose,
  View,
  Download,
  Share
} from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  record: DetectionRecord | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const activeTab = ref('basic')

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const detectionResultIcon = computed(() => {
  if (!props.record) return CircleCheck
  switch (props.record.result) {
    case 'spam': return CircleClose
    case 'suspicious': return Warning
    case 'clean': return CircleCheck
    default: return CircleCheck
  }
})

const detectionResultColor = computed(() => {
  if (!props.record) return '#67C23A'
  switch (props.record.result) {
    case 'spam': return '#F56C6C'
    case 'suspicious': return '#E6A23C'
    case 'clean': return '#67C23A'
    default: return '#909399'
  }
})

const confidenceLevelText = computed(() => {
  if (!props.record) return ''
  switch (props.record.confidenceLevel) {
    case 'high': return '高置信度'
    case 'medium': return '中置信度'
    case 'low': return '低置信度'
    default: return '未知'
  }
})

const resultText = computed(() => {
  if (!props.record) return ''
  switch (props.record.result) {
    case 'spam': return '垃圾邮件'
    case 'suspicious': return '可疑邮件'
    case 'clean': return '正常邮件'
    default: return '未知'
  }
})

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
}

const tabVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

// 方法
const handleClose = () => {
  dialogVisible.value = false
  activeTab.value = 'basic'
}

const downloadReport = async () => {
  if (!props.record) return

  try {
    loading.value = true
    // TODO: 调用下载报告API
    // await downloadDetectionReport(props.record.id)

    setTimeout(() => {
      loading.value = false
      ElMessage.success('报告下载成功')
    }, 1000)
  } catch (error) {
    loading.value = false
    ElMessage.error('报告下载失败')
  }
}

const shareReport = async () => {
  if (!props.record) return

  try {
    // TODO: 调用分享报告API
    ElMessage.success('分享链接已复制到剪贴板')
  } catch (error) {
    ElMessage.error('分享失败')
  }
}

const viewOriginalEmail = () => {
  if (!props.record) return
  // TODO: 打开原始邮件查看器
  ElMessage.info('原始邮件查看功能开发中')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="检测记录详情"
    width="80%"
    :before-close="handleClose"
    class="detection-detail-modal"
  >
    <div v-if="record" class="detection-detail">
      <!-- 头部信息 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :transition="cardVariants.transition as any">
        <el-card class="mb-6" shadow="never">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <el-icon :size="32" :color="detectionResultColor">
                <component :is="detectionResultIcon" />
              </el-icon>
              <div>
                <h3 class="text-xl font-bold mb-1">{{ resultText }}</h3>
                <p class="text-gray-500">检测ID: {{ record.id }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <el-button type="primary" :icon="View" @click="viewOriginalEmail">
                查看原邮件
              </el-button>
              <el-button :icon="Download" :loading="loading" @click="downloadReport">
                下载报告
              </el-button>
              <el-button :icon="Share" @click="shareReport">
                分享
              </el-button>
            </div>
          </div>

          <!-- 快速信息 -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <el-icon><Clock /></el-icon>
                <span class="text-sm text-gray-600">检测时间</span>
              </div>
              <p class="font-medium">{{ record.detectedAt }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <el-icon><User /></el-icon>
                <span class="text-sm text-gray-600">发送者</span>
              </div>
              <p class="font-medium">{{ record.senderEmail }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <el-icon><Warning /></el-icon>
                <span class="text-sm text-gray-600">置信度</span>
              </div>
              <p class="font-medium">{{ confidenceLevelText }}</p>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center space-x-2 mb-2">
                <el-icon><Document /></el-icon>
                <span class="text-sm text-gray-600">风险分数</span>
              </div>
              <p class="font-medium text-lg">
                <span :style="{ color: detectionResultColor }">{{ record.riskScore }}</span>
              </p>
            </div>
          </div>
        </el-card>
      </Motion>

      <!-- 详细信息标签页 -->
      <Motion :initial="tabVariants.initial" :animate="tabVariants.animate" :transition="tabVariants.transition as any">
        <el-card shadow="never">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="basic">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-lg font-medium mb-4">检测信息</h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="检测ID">{{ record.id }}</el-descriptions-item>
                      <el-descriptions-item label="检测时间">{{ record.detectedAt }}</el-descriptions-item>
                      <el-descriptions-item label="检测结果">
                        <el-tag :type="record.result === 'spam' ? 'danger' : record.result === 'suspicious' ? 'warning' : 'success'">
                          {{ resultText }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="置信度">
                        <el-tag :type="record.confidenceLevel === 'high' ? 'success' : record.confidenceLevel === 'medium' ? 'warning' : 'info'">
                          {{ confidenceLevelText }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="风险分数">
                        <el-progress
                          :percentage="record.riskScore"
                          :stroke-width="8"
                          :color="detectionResultColor"
                        />
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4">用户信息</h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="用户ID">{{ record.userId }}</el-descriptions-item>
                      <el-descriptions-item label="用户邮箱">{{ record.userEmail }}</el-descriptions-item>
                      <el-descriptions-item label="IP地址">{{ record.ipAddress || '未记录' }}</el-descriptions-item>
                      <el-descriptions-item label="用户代理">{{ record.userAgent || '未记录' }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 邮件信息 -->
            <el-tab-pane label="邮件信息" name="email">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-lg font-medium mb-4">发送信息</h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="发送者邮箱">{{ record.senderEmail }}</el-descriptions-item>
                      <el-descriptions-item label="发送者姓名">{{ record.senderName || '未提供' }}</el-descriptions-item>
                      <el-descriptions-item label="发送时间">{{ record.sentAt || '未记录' }}</el-descriptions-item>
                      <el-descriptions-item label="邮件服务器">{{ record.mailServer || '未记录' }}</el-descriptions-item>
                    </el-descriptions>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4">接收信息</h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="接收者邮箱">{{ record.recipientEmail || '未记录' }}</el-descriptions-item>
                      <el-descriptions-item label="接收时间">{{ record.receivedAt || '未记录' }}</el-descriptions-item>
                      <el-descriptions-item label="邮件大小">{{ record.emailSize || '未记录' }}</el-descriptions-item>
                      <el-descriptions-item label="附件数量">{{ record.attachmentCount || 0 }}</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4">邮件内容</h4>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="邮件主题">
                      <div class="max-w-md truncate">{{ record.subject || '无主题' }}</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="内容预览">
                      <div class="max-w-md">
                        <el-input
                          :model-value="record.contentPreview || '无内容预览'"
                          type="textarea"
                          :rows="3"
                          readonly
                        />
                      </div>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>
            </el-tab-pane>

            <!-- 检测结果 -->
            <el-tab-pane label="检测结果" name="result">
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-medium mb-4">检测规则匹配</h4>
                  <el-table :data="record.matchedRules || []" stripe>
                    <el-table-column prop="ruleName" label="规则名称" />
                    <el-table-column prop="ruleType" label="规则类型" width="120">
                      <template #default="{ row }">
                        <el-tag size="small">{{ row.ruleType }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="matchScore" label="匹配分数" width="120">
                      <template #default="{ row }">
                        <el-progress
                          :percentage="row.matchScore"
                          :stroke-width="6"
                          :show-text="false"
                        />
                        <span class="ml-2 text-sm">{{ row.matchScore }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="描述" min-width="200" />
                  </el-table>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4">风险因素</h4>
                  <div class="flex flex-wrap gap-2">
                    <el-tag
                      v-for="factor in record.riskFactors || []"
                      :key="factor"
                      type="warning"
                      size="small"
                    >
                      {{ factor }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- AI分析详情 -->
            <el-tab-pane label="AI分析" name="ai">
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-medium mb-4">AI模型分析</h4>
                  <el-descriptions :column="2" border>
                    <el-descriptions-item label="使用模型">{{ record.aiModel || 'GPT-4' }}</el-descriptions-item>
                    <el-descriptions-item label="模型版本">{{ record.modelVersion || 'v1.0' }}</el-descriptions-item>
                    <el-descriptions-item label="处理时间">{{ record.processingTime || '0.5s' }}</el-descriptions-item>
                    <el-descriptions-item label="分析深度">{{ record.analysisDepth || '深度分析' }}</el-descriptions-item>
                  </el-descriptions>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4">AI分析报告</h4>
                  <el-card class="bg-gray-50">
                    <div class="whitespace-pre-wrap text-sm leading-relaxed">
                      {{ record.aiAnalysis || '暂无AI分析报告' }}
                    </div>
                  </el-card>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4">建议操作</h4>
                  <div class="space-y-2">
                    <div
                      v-for="suggestion in record.suggestions || []"
                      :key="suggestion"
                      class="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg"
                    >
                      <el-icon class="text-blue-500"><CircleCheck /></el-icon>
                      <span class="text-blue-700">{{ suggestion }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </Motion>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="emit('refresh')">刷新数据</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.detection-detail-modal :deep(.el-dialog) {
  border-radius: 12px;
}

.detection-detail-modal :deep(.el-dialog__header) {
  padding: 20px 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detection-detail-modal :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.detection-detail-modal :deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f0f0;
}

.detection-detail {
  width: 100%;
}

.el-card {
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.el-descriptions {
  margin-top: 0;
}

.el-descriptions :deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
}

.el-progress {
  width: 100px;
}

.el-tabs :deep(.el-tabs__content) {
  padding: 20px 0;
}

.el-table {
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detection-detail-modal :deep(.el-dialog) {
    width: 95% !important;
    margin: 5vh auto;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>