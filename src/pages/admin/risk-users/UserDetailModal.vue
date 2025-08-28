<script setup lang="ts">
import { Motion } from 'motion-v'
import { ref, computed } from 'vue'
import type { RiskUser, RiskLevel, UserStatus } from '@/types/factory'
import { ElMessage } from 'element-plus'
import {
  User,
  Warning,
  Monitor,
  TrendCharts,
  Clock,
  Location,
  Message,
  Document,
  DataAnalysis,
  CircleCheck,
  Edit,
  Refresh
} from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  user: RiskUser | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const activeTab = ref('profile')

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const riskLevelColor = computed(() => {
  if (!props.user) return '#909399'
  switch (props.user.riskLevel) {
    case 'high': return '#F56C6C'
    case 'medium': return '#E6A23C'
    case 'low': return '#67C23A'
    default: return '#909399'
  }
})

const riskLevelText = computed(() => {
  if (!props.user) return ''
  switch (props.user.riskLevel) {
    case 'high': return '高风险'
    case 'medium': return '中风险'
    case 'low': return '低风险'
    default: return '未知'
  }
})

const statusText = computed(() => {
  if (!props.user) return ''
  switch (props.user.status) {
    case 'active': return '活跃'
    case 'monitoring': return '监控中'
    case 'restricted': return '受限'
    case 'suspended': return '暂停'
    default: return '未知'
  }
})

// 模拟数据
const behaviorData = ref([
  { date: '2024-01-15', emailsSent: 45, spamDetected: 12, riskScore: 85 },
  { date: '2024-01-14', emailsSent: 38, spamDetected: 8, riskScore: 78 },
  { date: '2024-01-13', emailsSent: 52, spamDetected: 15, riskScore: 88 },
  { date: '2024-01-12', emailsSent: 41, spamDetected: 9, riskScore: 82 },
  { date: '2024-01-11', emailsSent: 33, spamDetected: 6, riskScore: 75 }
])

const riskAnalysis = ref({
  behaviorPatterns: [
    '频繁在非工作时间发送邮件',
    '邮件内容重复度较高',
    '使用多个邮件模板',
    '发送频率异常增加'
  ],
  contentAnalysis: [
    '包含营销推广内容',
    '使用诱导性语言',
    '包含可疑链接',
    '邮件格式不规范'
  ],
  networkAnalysis: [
    'IP地址频繁变化',
    '使用代理服务器',
    '地理位置异常',
    '设备指纹不一致'
  ]
})

const actionHistory = ref([
  { date: '2024-01-15 10:30', action: '标记为高风险用户', operator: '系统自动', result: '成功' },
  { date: '2024-01-14 16:20', action: '发送警告通知', operator: '管理员', result: '已发送' },
  { date: '2024-01-13 09:15', action: '限制发送频率', operator: '系统自动', result: '已执行' },
  { date: '2024-01-12 14:45', action: '人工审核', operator: '审核员A', result: '待处理' }
])

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
  activeTab.value = 'profile'
}

const updateUserStatus = async (status: UserStatus) => {
  if (!props.user) return

  try {
    loading.value = true
    // TODO: 调用更新用户状态API
    // await updateRiskUserStatus(props.user.id, status)

    setTimeout(() => {
      loading.value = false
      ElMessage.success('用户状态更新成功')
      emit('refresh')
    }, 1000)
  } catch (error) {
    loading.value = false
    ElMessage.error('用户状态更新失败')
  }
}

const refreshUserData = async () => {
  if (!props.user) return

  try {
    loading.value = true
    // TODO: 调用刷新用户数据API
    // await refreshRiskUserData(props.user.id)

    setTimeout(() => {
      loading.value = false
      ElMessage.success('用户数据刷新成功')
      emit('refresh')
    }, 1000)
  } catch (error) {
    loading.value = false
    ElMessage.error('用户数据刷新失败')
  }
}

const exportUserReport = async () => {
  if (!props.user) return

  try {
    loading.value = true
    // TODO: 调用导出用户报告API
    // await exportRiskUserReport(props.user.id)

    setTimeout(() => {
      loading.value = false
      ElMessage.success('用户报告导出成功')
    }, 1000)
  } catch (error) {
    loading.value = false
    ElMessage.error('用户报告导出失败')
  }
}

// 获取风险等级标签类型
const getRiskLevelTagType = (level: RiskLevel) => {
  switch (level) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'info'
  }
}

// 获取用户状态标签类型
const getUserStatusTagType = (status: UserStatus) => {
  switch (status) {
    case 'active': return 'success'
    case 'monitoring': return 'warning'
    case 'restricted': return 'danger'
    case 'suspended': return 'info'
    default: return 'info'
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="风险用户详情" width="85%" :before-close="handleClose" class="user-detail-modal">
    <div v-if="user" class="user-detail">
      <!-- 用户头部信息 -->
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :transition="cardVariants.transition as any">
        <el-card class="mb-6" shadow="never">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-6">
              <el-avatar :size="80" :src="user.avatar">
                {{ user.name.charAt(0) }}
              </el-avatar>
              <div>
                <h3 class="text-2xl font-bold mb-2">{{ user.name }}</h3>
                <p class="text-gray-600 mb-2">{{ user.email }}</p>
                <div class="flex items-center space-x-4">
                  <el-tag :type="getRiskLevelTagType(user.riskLevel)" size="large">
                    {{ riskLevelText }}
                  </el-tag>
                  <el-tag :type="getUserStatusTagType(user.status)" size="large">
                    {{ statusText }}
                  </el-tag>
                  <span class="text-sm text-gray-500">ID: {{ user.id }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <el-button :icon="Refresh" :loading="loading" @click="refreshUserData">
                刷新数据
              </el-button>
              <el-button :icon="Document" @click="exportUserReport">
                导出报告
              </el-button>
              <el-dropdown @command="updateUserStatus">
                <el-button type="primary" :icon="Edit">
                  更新状态
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="active">设为活跃</el-dropdown-item>
                    <el-dropdown-item command="monitoring">设为监控</el-dropdown-item>
                    <el-dropdown-item command="restricted">设为受限</el-dropdown-item>
                    <el-dropdown-item command="suspended">设为暂停</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>

          <!-- 关键指标 -->
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="bg-red-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-red-600 mb-1">{{ user.riskScore }}</div>
              <div class="text-sm text-red-500">风险分数</div>
            </div>

            <div class="bg-blue-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-blue-600 mb-1">{{ user.detectionCount }}</div>
              <div class="text-sm text-blue-500">检测次数</div>
            </div>

            <div class="bg-yellow-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-yellow-600 mb-1">{{ Math.round(user.spamRate * 100) }}%</div>
              <div class="text-sm text-yellow-500">垃圾邮件率</div>
            </div>

            <div class="bg-green-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600 mb-1">{{ user.riskFactors.length }}</div>
              <div class="text-sm text-green-500">风险因素</div>
            </div>

            <div class="bg-purple-50 p-4 rounded-lg text-center">
              <div class="text-2xl font-bold text-purple-600 mb-1">7</div>
              <div class="text-sm text-purple-500">活跃天数</div>
            </div>
          </div>
        </el-card>
      </Motion>

      <!-- 详细信息标签页 -->
      <Motion :initial="tabVariants.initial" :animate="tabVariants.animate" :transition="tabVariants.transition as any">
        <el-card shadow="never">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- 用户档案 -->
            <el-tab-pane label="用户档案" name="profile">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-lg font-medium mb-4 flex items-center">
                      <el-icon class="mr-2">
                        <User />
                      </el-icon>
                      基本信息
                    </h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="用户ID">{{ user.userId }}</el-descriptions-item>
                      <el-descriptions-item label="用户姓名">{{ user.name }}</el-descriptions-item>
                      <el-descriptions-item label="邮箱地址">{{ user.email }}</el-descriptions-item>
                      <el-descriptions-item label="注册时间">{{ user.createdAt }}</el-descriptions-item>
                      <el-descriptions-item label="最后更新">{{ user.updatedAt }}</el-descriptions-item>
                      <el-descriptions-item label="最后活动">{{ user.lastActivity }}</el-descriptions-item>
                    </el-descriptions>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4 flex items-center">
                      <el-icon class="mr-2">
                        <CircleCheck />
                      </el-icon>
                      风险信息
                    </h4>
                    <el-descriptions :column="1" border>
                      <el-descriptions-item label="风险等级">
                        <el-tag :type="getRiskLevelTagType(user.riskLevel)">
                          {{ riskLevelText }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="风险分数">
                        <div class="flex items-center space-x-2">
                          <el-progress :percentage="user.riskScore" :stroke-width="8" :color="riskLevelColor" />
                          <span class="font-medium">{{ user.riskScore }}</span>
                        </div>
                      </el-descriptions-item>
                      <el-descriptions-item label="用户状态">
                        <el-tag :type="getUserStatusTagType(user.status)">
                          {{ statusText }}
                        </el-tag>
                      </el-descriptions-item>
                      <el-descriptions-item label="检测次数">{{ user.detectionCount }}</el-descriptions-item>
                      <el-descriptions-item label="垃圾邮件率">{{ Math.round(user.spamRate * 100) }}%</el-descriptions-item>
                    </el-descriptions>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4 flex items-center">
                    <el-icon class="mr-2">
                      <Warning />
                    </el-icon>
                    风险因素
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <el-tag v-for="factor in user.riskFactors" :key="factor" type="warning" size="large">
                      {{ factor }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 行为分析 -->
            <el-tab-pane label="行为分析" name="behavior">
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-medium mb-4 flex items-center">
                    <el-icon class="mr-2">
                      <TrendCharts />
                    </el-icon>
                    行为趋势
                  </h4>
                  <el-table :data="behaviorData" stripe>
                    <el-table-column prop="date" label="日期" width="120" />
                    <el-table-column prop="emailsSent" label="发送邮件数" width="120" />
                    <el-table-column prop="spamDetected" label="垃圾邮件数" width="120">
                      <template #default="{ row }">
                        <span :class="{
                          'text-red-600': row.spamDetected > 10,
                          'text-yellow-600': row.spamDetected > 5 && row.spamDetected <= 10,
                          'text-green-600': row.spamDetected <= 5
                        }">
                          {{ row.spamDetected }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="riskScore" label="当日风险分数" width="150">
                      <template #default="{ row }">
                        <div class="flex items-center space-x-2">
                          <el-progress :percentage="row.riskScore" :stroke-width="6" :show-text="false"
                            :color="row.riskScore >= 80 ? '#F56C6C' : row.riskScore >= 60 ? '#E6A23C' : '#67C23A'" />
                          <span class="text-sm">{{ row.riskScore }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="垃圾邮件率" width="120">
                      <template #default="{ row }">
                        {{ Math.round((row.spamDetected / row.emailsSent) * 100) }}%
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 class="text-lg font-medium mb-4">行为模式分析</h4>
                    <div class="space-y-2">
                      <div v-for="pattern in riskAnalysis.behaviorPatterns" :key="pattern"
                        class="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                        <el-icon class="text-yellow-500">
                          <Clock />
                        </el-icon>
                        <span class="text-yellow-700 text-sm">{{ pattern }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4">内容分析</h4>
                    <div class="space-y-2">
                      <div v-for="content in riskAnalysis.contentAnalysis" :key="content"
                        class="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                        <el-icon class="text-red-500">
                          <Message />
                        </el-icon>
                        <span class="text-red-700 text-sm">{{ content }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4">网络分析</h4>
                    <div class="space-y-2">
                      <div v-for="network in riskAnalysis.networkAnalysis" :key="network"
                        class="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <el-icon class="text-blue-500">
                          <Location />
                        </el-icon>
                        <span class="text-blue-700 text-sm">{{ network }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 操作历史 -->
            <el-tab-pane label="操作历史" name="history">
              <div class="space-y-6">
                <div>
                  <h4 class="text-lg font-medium mb-4 flex items-center">
                    <el-icon class="mr-2">
                      <DataAnalysis />
                    </el-icon>
                    管理操作记录
                  </h4>
                  <el-timeline>
                    <el-timeline-item v-for="(action, index) in actionHistory" :key="index" :timestamp="action.date"
                      placement="top">
                      <el-card class="timeline-card">
                        <div class="flex items-center justify-between">
                          <div>
                            <h4 class="font-medium mb-1">{{ action.action }}</h4>
                            <p class="text-sm text-gray-600">操作人员: {{ action.operator }}</p>
                          </div>
                          <el-tag :type="action.result === '成功' || action.result === '已发送' || action.result === '已执行' ? 'success' :
                            action.result === '待处理' ? 'warning' : 'info'" size="small">
                            {{ action.result }}
                          </el-tag>
                        </div>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </div>
            </el-tab-pane>

            <!-- 风险评估 -->
            <el-tab-pane label="风险评估" name="assessment">
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 class="text-lg font-medium mb-4">风险评估报告</h4>
                    <el-card class="bg-gray-50">
                      <div class="space-y-4">
                        <div class="flex items-center justify-between">
                          <span class="font-medium">总体风险等级</span>
                          <el-tag :type="getRiskLevelTagType(user.riskLevel)" size="large">
                            {{ riskLevelText }}
                          </el-tag>
                        </div>

                        <div class="flex items-center justify-between">
                          <span class="font-medium">风险分数</span>
                          <div class="flex items-center space-x-2">
                            <el-progress :percentage="user.riskScore" :stroke-width="8" :color="riskLevelColor"
                              style="width: 100px;" />
                            <span class="font-bold text-lg">{{ user.riskScore }}</span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between">
                          <span class="font-medium">威胁程度</span>
                          <span :class="{
                            'text-red-600': user.riskScore >= 80,
                            'text-yellow-600': user.riskScore >= 60 && user.riskScore < 80,
                            'text-green-600': user.riskScore < 60
                          }" class="font-medium">
                            {{ user.riskScore >= 80 ? '高威胁' : user.riskScore >= 60 ? '中威胁' : '低威胁' }}
                          </span>
                        </div>

                        <div class="flex items-center justify-between">
                          <span class="font-medium">建议操作</span>
                          <span class="text-blue-600 font-medium">
                            {{ user.riskScore >= 80 ? '立即限制' : user.riskScore >= 60 ? '加强监控' : '正常监控' }}
                          </span>
                        </div>
                      </div>
                    </el-card>
                  </div>

                  <div>
                    <h4 class="text-lg font-medium mb-4">风险趋势预测</h4>
                    <el-card class="bg-gray-50">
                      <div class="text-center py-8">
                        <el-icon size="48" class="text-gray-400 mb-4">
                          <TrendCharts />
                        </el-icon>
                        <p class="text-gray-500">风险趋势图表</p>
                        <p class="text-sm text-gray-400 mt-2">基于历史数据预测未来7天风险变化</p>
                      </div>
                    </el-card>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-medium mb-4">详细风险分析</h4>
                  <el-card>
                    <div class="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      该用户在过去30天内表现出多项高风险行为特征：

                      1. 邮件发送模式异常：频繁在非工作时间（晚上10点后、凌晨时段）发送大量邮件，与正常用户行为模式存在显著差异。

                      2. 内容重复度高：通过内容分析发现，该用户发送的邮件中有78%存在高度相似的内容模板，疑似批量发送垃圾邮件。

                      3. 收件人分布异常：邮件收件人地址分布广泛，缺乏明确的业务关联性，符合垃圾邮件发送者的典型特征。

                      4. 技术指纹异常：检测到该用户使用多个不同的IP地址和设备指纹，存在使用代理服务器或虚拟环境的可能。

                      建议采取以下措施：
                      - 立即将该用户列入重点监控名单
                      - 限制其邮件发送频率和数量
                      - 对其发送的邮件进行更严格的内容审查
                      - 考虑暂时冻结账户直至进一步调查
                    </div>
                  </el-card>
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
.user-detail-modal :deep(.el-dialog) {
  border-radius: 12px;
}

.user-detail-modal :deep(.el-dialog__header) {
  padding: 20px 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.user-detail-modal :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 75vh;
  overflow-y: auto;
}

.user-detail-modal :deep(.el-dialog__footer) {
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f0f0;
}

.user-detail {
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
  width: 120px;
}

.el-tabs :deep(.el-tabs__content) {
  padding: 20px 0;
}

.el-table {
  border-radius: 6px;
}

.timeline-card {
  margin-bottom: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.timeline-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 用户头像样式 */
.el-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 32px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-detail-modal :deep(.el-dialog) {
    width: 95% !important;
    margin: 5vh auto;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .flex {
    flex-direction: column;
    align-items: stretch;
  }

  .space-x-6>*+* {
    margin-left: 0;
    margin-top: 1rem;
  }
}
</style>