<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">检测统计</h1>
          <p class="text-base-content/70">查看系统检测性能和邮件分析报告</p>
        </div>
        <div class="flex gap-2">
          <select class="select select-bordered" v-model="timeRange">
            <option value="7">最近7天</option>
            <option value="30">最近30天</option>
            <option value="90">最近90天</option>
            <option value="365">最近一年</option>
          </select>
          <button class="btn btn-primary" @click="exportReport">导出报告</button>
        </div>
      </div>

      <!-- 总体统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="stat-title">总检测次数</div>
            <div class="stat-value text-primary">{{ totalDetections }}</div>
            <div class="stat-desc">{{ timeRangeText }}内</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="stat-title">垃圾邮件</div>
            <div class="stat-value text-error">{{ spamDetections }}</div>
            <div class="stat-desc">{{ spamRate }}% 检出率</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">安全邮件</div>
            <div class="stat-value text-success">{{ safeDetections }}</div>
            <div class="stat-desc">{{ safeRate }}% 安全率</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title">平均响应时间</div>
            <div class="stat-value text-info">{{ avgResponseTime }}ms</div>
            <div class="stat-desc">检测速度</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 检测趋势图 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">检测趋势</h3>
            <div class="h-64 flex items-center justify-center bg-base-100 rounded">
              <canvas ref="trendChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

        <!-- 检测结果分布 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">检测结果分布</h3>
            <div class="h-64 flex items-center justify-center bg-base-100 rounded">
              <canvas ref="pieChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能指标 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 检测准确率 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">检测准确率</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between mb-1">
                  <span>垃圾邮件识别率</span>
                  <span class="font-semibold">{{ spamAccuracy }}%</span>
                </div>
                <progress class="progress progress-error w-full" :value="spamAccuracy" max="100"></progress>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span>安全邮件识别率</span>
                  <span class="font-semibold">{{ safeAccuracy }}%</span>
                </div>
                <progress class="progress progress-success w-full" :value="safeAccuracy" max="100"></progress>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span>误报率</span>
                  <span class="font-semibold">{{ falsePositiveRate }}%</span>
                </div>
                <progress class="progress progress-warning w-full" :value="falsePositiveRate" max="100"></progress>
              </div>
              <div>
                <div class="flex justify-between mb-1">
                  <span>漏报率</span>
                  <span class="font-semibold">{{ falseNegativeRate }}%</span>
                </div>
                <progress class="progress progress-info w-full" :value="falseNegativeRate" max="100"></progress>
              </div>
            </div>
          </div>
        </div>

        <!-- 检测特征分析 -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">检测特征分析</h3>
            <div class="space-y-3">
              <div v-for="feature in topFeatures" :key="feature.name" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full" :class="getFeatureColor(feature.importance)"></div>
                  <span>{{ feature.name }}</span>
                </div>
                <div class="text-right">
                  <div class="font-semibold">{{ feature.detectionCount }}</div>
                  <div class="text-sm text-base-content/70">检出次数</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间分布分析 -->
      <div class="card bg-base-200 shadow-sm mb-8">
        <div class="card-body">
          <h3 class="card-title mb-4">时间分布分析</h3>
          <div class="h-64 flex items-center justify-center bg-base-100 rounded">
            <canvas ref="timeChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      <!-- 详细报告表格 -->
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <div class="flex justify-between items-center mb-4">
            <h3 class="card-title">详细统计报告</h3>
            <div class="flex gap-2">
              <select class="select select-bordered select-sm" v-model="reportType">
                <option value="daily">按日统计</option>
                <option value="weekly">按周统计</option>
                <option value="monthly">按月统计</option>
              </select>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>总检测数</th>
                  <th>垃圾邮件</th>
                  <th>安全邮件</th>
                  <th>可疑邮件</th>
                  <th>平均响应时间</th>
                  <th>准确率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in detailedReports" :key="report.period">
                  <td>{{ report.period }}</td>
                  <td>{{ report.total }}</td>
                  <td><span class="badge badge-error">{{ report.spam }}</span></td>
                  <td><span class="badge badge-success">{{ report.safe }}</span></td>
                  <td><span class="badge badge-warning">{{ report.suspicious }}</span></td>
                  <td>{{ report.avgTime }}ms</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <progress class="progress progress-primary w-16" :value="report.accuracy" max="100"></progress>
                      <span class="text-sm">{{ report.accuracy }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

// 时间范围选择
const timeRange = ref('30')
const reportType = ref('daily')

// 图表引用
const trendChart = ref<HTMLCanvasElement>()
const pieChart = ref<HTMLCanvasElement>()
const timeChart = ref<HTMLCanvasElement>()

// 统计数据
const statisticsData = ref({
  totalDetections: 1247,
  spamDetections: 312,
  safeDetections: 856,
  suspiciousDetections: 79,
  avgResponseTime: 1150,
  spamAccuracy: 94.2,
  safeAccuracy: 97.8,
  falsePositiveRate: 2.1,
  falseNegativeRate: 1.8
})

// 计算属性
const totalDetections = computed(() => statisticsData.value.totalDetections)
const spamDetections = computed(() => statisticsData.value.spamDetections)
const safeDetections = computed(() => statisticsData.value.safeDetections)
const avgResponseTime = computed(() => statisticsData.value.avgResponseTime)

const spamRate = computed(() => 
  totalDetections.value > 0 ? Math.round((spamDetections.value / totalDetections.value) * 100) : 0
)
const safeRate = computed(() => 
  totalDetections.value > 0 ? Math.round((safeDetections.value / totalDetections.value) * 100) : 0
)

const spamAccuracy = computed(() => statisticsData.value.spamAccuracy)
const safeAccuracy = computed(() => statisticsData.value.safeAccuracy)
const falsePositiveRate = computed(() => statisticsData.value.falsePositiveRate)
const falseNegativeRate = computed(() => statisticsData.value.falseNegativeRate)

const timeRangeText = computed(() => {
  const days = parseInt(timeRange.value)
  if (days === 7) return '最近7天'
  if (days === 30) return '最近30天'
  if (days === 90) return '最近90天'
  if (days === 365) return '最近一年'
  return '选定时间'
})

// 检测特征数据
const topFeatures = ref([
  { name: '关键词匹配', detectionCount: 156, importance: 0.85 },
  { name: '发件人信誉', detectionCount: 134, importance: 0.78 },
  { name: '链接检测', detectionCount: 98, importance: 0.72 },
  { name: '附件扫描', detectionCount: 67, importance: 0.65 },
  { name: '邮件头分析', detectionCount: 45, importance: 0.58 },
  { name: '内容结构', detectionCount: 32, importance: 0.51 }
])

// 详细报告数据
const detailedReports = ref([
  { period: '2024-01-15', total: 89, spam: 23, safe: 58, suspicious: 8, avgTime: 1120, accuracy: 95.5 },
  { period: '2024-01-14', total: 76, spam: 19, safe: 52, suspicious: 5, avgTime: 1080, accuracy: 96.1 },
  { period: '2024-01-13', total: 92, spam: 28, safe: 56, suspicious: 8, avgTime: 1200, accuracy: 94.6 },
  { period: '2024-01-12', total: 68, spam: 15, safe: 48, suspicious: 5, avgTime: 1050, accuracy: 97.1 },
  { period: '2024-01-11', total: 84, spam: 22, safe: 54, suspicious: 8, avgTime: 1180, accuracy: 95.2 },
  { period: '2024-01-10', total: 71, spam: 18, safe: 47, suspicious: 6, avgTime: 1090, accuracy: 96.5 },
  { period: '2024-01-09', total: 95, spam: 31, safe: 58, suspicious: 6, avgTime: 1250, accuracy: 94.7 }
])

// 获取特征重要性颜色
const getFeatureColor = (importance: number) => {
  if (importance > 0.8) return 'bg-error'
  if (importance > 0.6) return 'bg-warning'
  if (importance > 0.4) return 'bg-info'
  return 'bg-success'
}

// 导出报告
const exportReport = () => {
  alert('导出统计报告功能开发中...')
}

// 初始化图表
const initCharts = async () => {
  await nextTick()
  
  // 这里应该使用实际的图表库（如 Chart.js 或 ECharts）
  // 为了演示，我们只是在 canvas 上绘制简单的占位符
  
  if (trendChart.value) {
    const ctx = trendChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, trendChart.value.width, trendChart.value.height)
      ctx.fillStyle = '#6b7280'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('检测趋势图', trendChart.value.width / 2, trendChart.value.height / 2)
    }
  }
  
  if (pieChart.value) {
    const ctx = pieChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, pieChart.value.width, pieChart.value.height)
      ctx.fillStyle = '#6b7280'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('结果分布图', pieChart.value.width / 2, pieChart.value.height / 2)
    }
  }
  
  if (timeChart.value) {
    const ctx = timeChart.value.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, timeChart.value.width, timeChart.value.height)
      ctx.fillStyle = '#6b7280'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('时间分布图', timeChart.value.width / 2, timeChart.value.height / 2)
    }
  }
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.active {
  @apply bg-primary text-primary-content;
}

canvas {
  max-width: 100%;
  height: auto;
}
</style>