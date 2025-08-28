<script setup lang="ts">
import { Motion } from 'motion-v'
import { 
  Refresh, 
  User, 
  CircleCheck, 
  Warning, 
  Monitor, 
  TrendCharts, 
  PieChart,
  DataAnalysis,
  Connection,
  Clock,
  Document,
  Download
} from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

// 系统状态数据
const systemStatus = reactive({
  status: 'running', // running, warning, error
  uptime: '15天 8小时 32分钟',
  aiModelAccuracy: 96.8,
  databaseUsage: 68,
  apiResponseTime: 0.8,
  apiStatus: 'normal'
})

// 关键指标数据
const keyMetrics = reactive({
  totalUsers: { value: 2456, growth: 5.2 },
  totalDetections: { value: 45678, growth: 12.8 },
  spamBlocked: { value: 3245, growth: -2.1 },
  riskUsers: { value: 23, growth: 15.0 }
})

// 最近系统活动
const recentActivities = ref([
  { time: '2024-01-15 14:30', type: 'detection', message: '检测到高风险邮件，已自动拦截', status: 'success' },
  { time: '2024-01-15 14:25', type: 'user', message: '新用户注册：user@example.com', status: 'info' },
  { time: '2024-01-15 14:20', type: 'system', message: 'AI模型准确率提升至96.8%', status: 'success' },
  { time: '2024-01-15 14:15', type: 'warning', message: '检测到异常用户行为模式', status: 'warning' },
  { time: '2024-01-15 14:10', type: 'detection', message: '批量检测完成，处理邮件1,234封', status: 'success' }
])

// 系统警报
const systemAlerts = ref([
  { level: 'warning', message: '数据库使用率达到68%，建议清理历史数据', time: '10分钟前' },
  { level: 'info', message: 'AI模型已更新至最新版本', time: '2小时前' }
])

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] }
}

// 方法
const refreshData = async () => {
  try {
    loading.value = true
    // TODO: 调用刷新数据API
    // await refreshDashboardData()
    
    // 模拟API调用
    setTimeout(() => {
      loading.value = false
      ElMessage.success('数据刷新成功')
    }, 1500)
  } catch (error) {
    loading.value = false
    ElMessage.error('数据刷新失败')
  }
}

const exportSystemReport = async () => {
  try {
    // TODO: 调用导出系统报告API
    // await exportReport()
    
    ElMessage.success('系统报告导出成功')
  } catch (error) {
    ElMessage.error('系统报告导出失败')
  }
}

// 获取系统状态颜色
const getSystemStatusColor = (status: string) => {
  switch (status) {
    case 'running': return 'success'
    case 'warning': return 'warning'
    case 'error': return 'danger'
    default: return 'info'
  }
}

// 获取增长率颜色
const getGrowthColor = (growth: number) => {
  if (growth > 0) return 'text-green-600'
  if (growth < 0) return 'text-red-600'
  return 'text-gray-600'
}

// 获取增长率图标
const getGrowthIcon = (growth: number) => {
  if (growth > 0) return '↗'
  if (growth < 0) return '↘'
  return '→'
}

// 获取活动状态标签类型
const getActivityTagType = (status: string) => {
  switch (status) {
    case 'success': return 'success'
    case 'warning': return 'warning'
    case 'error': return 'danger'
    default: return 'info'
  }
}

// 获取警报级别标签类型
const getAlertTagType = (level: string) => {
  switch (level) {
    case 'warning': return 'warning'
    case 'error': return 'danger'
    default: return 'info'
  }
}

// 组件挂载时加载数据
onMounted(() => {
  // TODO: 初始化数据加载
  console.log('仪表板数据加载完成')
})
</script>

<template>
  <div class="dashboard">
    <!-- 系统仪表板页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-lg font-medium">系统仪表板</span>
              <p class="text-sm text-gray-500 mt-1">垃圾邮件检测系统概览与监控</p>
            </div>
            <div class="flex gap-2">
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
                <el-button type="primary" :icon="Refresh" :loading="loading" @click="refreshData">刷新数据</el-button>
              </Motion>
              <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
                :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.6 }">
                <el-button type="default" :icon="Download" @click="exportSystemReport">导出报告</el-button>
              </Motion>
            </div>
          </div>
        </template>

        <!-- 系统状态概览 -->
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.1 }">
          <el-card class="mb-6" shadow="hover">
            <template #header>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2 font-medium">
                  <el-icon><Monitor /></el-icon>
                  系统状态
                </span>
                <el-tag 
                  :type="getSystemStatusColor(systemStatus.status)"
                  size="large"
                >
                  {{ systemStatus.status === 'running' ? '运行正常' : 
                     systemStatus.status === 'warning' ? '警告' : '错误' }}
                </el-tag>
              </div>
            </template>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <el-icon size="20" color="#409EFF"><Clock /></el-icon>
                <div>
                  <div class="text-sm text-gray-600">系统运行时间</div>
                  <div class="font-semibold">{{ systemStatus.uptime }}</div>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <el-icon size="20" color="#67C23A"><DataAnalysis /></el-icon>
                <div>
                  <div class="text-sm text-gray-600">AI模型准确率</div>
                  <div class="font-semibold">{{ systemStatus.aiModelAccuracy }}%</div>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <el-icon size="20" color="#E6A23C"><Monitor /></el-icon>
                <div>
                  <div class="text-sm text-gray-600">数据库使用率</div>
                  <div class="font-semibold">{{ systemStatus.databaseUsage }}%</div>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <el-icon size="20" color="#F56C6C"><Connection /></el-icon>
                <div>
                  <div class="text-sm text-gray-600">API响应时间</div>
                  <div class="font-semibold">{{ systemStatus.apiResponseTime }}s</div>
                </div>
              </div>
            </div>
          </el-card>
        </Motion>

        <!-- 关键指标统计 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总用户数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-blue-900">{{ keyMetrics.totalUsers.value.toLocaleString() }}</p>
                </Motion>
                <span :class="['text-xs', getGrowthColor(keyMetrics.totalUsers.growth)]">
                  {{ getGrowthIcon(keyMetrics.totalUsers.growth) }} {{ Math.abs(keyMetrics.totalUsers.growth) }}%
                </span>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <el-icon size="32">
                  <User />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">总检测次数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-green-900">{{ keyMetrics.totalDetections.value.toLocaleString() }}</p>
                </Motion>
                <span :class="['text-xs', getGrowthColor(keyMetrics.totalDetections.growth)]">
                  {{ getGrowthIcon(keyMetrics.totalDetections.growth) }} {{ Math.abs(keyMetrics.totalDetections.growth) }}%
                </span>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <el-icon size="32">
                  <Document />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">拦截垃圾邮件</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ keyMetrics.spamBlocked.value.toLocaleString() }}</p>
                </Motion>
                <span :class="['text-xs', getGrowthColor(keyMetrics.spamBlocked.growth)]">
                  {{ getGrowthIcon(keyMetrics.spamBlocked.growth) }} {{ Math.abs(keyMetrics.spamBlocked.growth) }}%
                </span>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <CircleCheck />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">风险用户</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-2xl font-bold text-red-900">{{ keyMetrics.riskUsers.value }}</p>
                </Motion>
                <span :class="['text-xs', getGrowthColor(keyMetrics.riskUsers.growth)]">
                  {{ getGrowthIcon(keyMetrics.riskUsers.growth) }} {{ Math.abs(keyMetrics.riskUsers.growth) }}%
                </span>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-red-500">
                <el-icon size="32">
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>

        </div>

        <!-- 数据可视化图表区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- 检测趋势图 -->
          <Motion :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.6, delay: 0.8 }">
            <el-card class="chart-placeholder" shadow="hover">
              <template #header>
                <span class="flex items-center gap-2 text-lg font-medium">
                  <el-icon><TrendCharts /></el-icon>
                  检测趋势分析
                </span>
              </template>
              <div class="h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <el-icon size="48" class="mb-4">
                    <TrendCharts />
                  </el-icon>
                  <p>7天检测趋势图表</p>
                  <p class="text-sm mt-2">图表组件待集成</p>
                </div>
              </div>
            </el-card>
          </Motion>

          <!-- 用户活动图 -->
          <Motion :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.6, delay: 0.9 }">
            <el-card class="chart-placeholder" shadow="hover">
              <template #header>
                <span class="flex items-center gap-2 text-lg font-medium">
                  <el-icon><User /></el-icon>
                  用户活动统计
                </span>
              </template>
              <div class="h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <el-icon size="48" class="mb-4">
                    <User />
                  </el-icon>
                  <p>用户活跃度分析</p>
                  <p class="text-sm mt-2">图表组件待集成</p>
                </div>
              </div>
            </el-card>
          </Motion>
        </div>

        <!-- 检测结果分布图 -->
        <Motion :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.6, delay: 1.0 }">
          <el-card class="chart-placeholder mb-6" shadow="hover">
            <template #header>
              <span class="flex items-center gap-2 text-lg font-medium">
                <el-icon><PieChart /></el-icon>
                检测结果分布
              </span>
            </template>
            <div class="h-64 flex items-center justify-center text-gray-400">
              <div class="text-center">
                <el-icon size="48" class="mb-4">
                  <PieChart />
                </el-icon>
                <p>垃圾邮件 vs 正常邮件分布</p>
                <p class="text-sm mt-2">图表组件待集成</p>
              </div>
            </div>
          </el-card>
        </Motion>

        <!-- 实时监控区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 最近系统活动 -->
          <Motion :initial="{ opacity: 0, x: -20 }" :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 1.1 }">
            <el-card shadow="hover">
              <template #header>
                <span class="flex items-center gap-2 text-lg font-medium">
                  <el-icon><Monitor /></el-icon>
                  最近系统活动
                </span>
              </template>
              <div class="max-h-80 overflow-y-auto">
                <div 
                  v-for="(activity, index) in recentActivities" 
                  :key="index"
                  class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <el-tag 
                    :type="getActivityTagType(activity.status)"
                    size="small"
                    class="mt-1"
                  >
                    {{ activity.type === 'detection' ? '检测' : 
                       activity.type === 'user' ? '用户' : 
                       activity.type === 'system' ? '系统' : '警告' }}
                  </el-tag>
                  <div class="flex-1">
                    <p class="text-sm text-gray-800">{{ activity.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                  </div>
                </div>
              </div>
            </el-card>
          </Motion>

          <!-- 系统警报 -->
          <Motion :initial="{ opacity: 0, x: 20 }" :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 1.2 }">
            <el-card shadow="hover">
              <template #header>
                <span class="flex items-center gap-2 text-lg font-medium">
                  <el-icon><Warning /></el-icon>
                  系统警报
                </span>
              </template>
              <div class="space-y-3">
                <div 
                  v-for="(alert, index) in systemAlerts" 
                  :key="index"
                  class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <el-tag 
                    :type="getAlertTagType(alert.level)"
                    size="small"
                    class="mt-1"
                  >
                    {{ alert.level === 'warning' ? '警告' : 
                       alert.level === 'error' ? '错误' : '信息' }}
                  </el-tag>
                  <div class="flex-1">
                    <p class="text-sm text-gray-800">{{ alert.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ alert.time }}</p>
                  </div>
                </div>
                
                <div v-if="systemAlerts.length === 0" class="text-center py-8 text-gray-400">
                  <el-icon size="32" class="mb-2">
                    <Shield />
                  </el-icon>
                  <p>暂无系统警报</p>
                </div>
              </div>
            </el-card>
          </Motion>
        </div>
      </el-card>
    </Motion>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.chart-placeholder {
  transition: all 0.3s ease;
}

.chart-placeholder:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 系统状态卡片样式 */
.system-status-card {
  margin-bottom: 24px;
}

.system-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.status-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.status-icon {
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.status-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

/* 活动列表样式 */
.activity-item {
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background-color: #f8fafc;
}

/* 警报样式 */
.alert-item {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.2s ease;
}

.alert-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 增强卡片视觉效果 */
:deep(.el-card) {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

:deep(.el-card:hover) {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 统计卡片增长率样式 */
.stats-trend {
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

.text-gray-600 {
  color: #4b5563;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 8px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: flex-start;
  }
  
  .system-status-grid {
    grid-template-columns: 1fr;
  }
  
  .status-item {
    padding: 12px;
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .header-actions {
    flex-direction: column;
  }
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>