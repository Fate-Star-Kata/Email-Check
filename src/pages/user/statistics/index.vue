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
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- 统计内容 -->
      <div v-else>
        <!-- 总体统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                  </path>
                </svg>
              </div>
              <div class="stat-title">总检测次数</div>
              <div class="stat-value text-primary">{{ totalDetections }}</div>
            </div>
          </div>

          <div class="stats shadow">
            <div class="stat">
              <div class="stat-figure text-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-8 h-8 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z">
                  </path>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="stat-title">收藏数量</div>
              <div class="stat-value text-info">{{ favoriteCount }}</div>
              <div class="stat-desc">准确率 {{ accuracyRate }}%</div>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- 风险因素统计 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title mb-4">风险因素统计</h2>
              <div class="h-64">
                <VChart :option="riskFactorsOption" class="w-full h-full" />
              </div>
            </div>
          </div>

          <!-- 检测结果分布 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title mb-4">检测结果分布</h2>
              <div class="h-64">
                <VChart :option="resultDistributionOption" class="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        <!-- 检测趋势 -->
        <div class="card bg-base-200 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title mb-4">检测趋势</h2>
            <div class="h-64">
              <VChart :option="trendOption" class="w-full h-full" />
            </div>
          </div>
        </div>

        <!-- 时间分布分析 -->
        <div class="card bg-base-200 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title mb-4">时间分布分析</h2>
            <div class="h-64">
              <VChart :option="timeDistributionOption" class="w-full h-full" />
            </div>
          </div>
        </div>

        <!-- 详细统计报告 -->
        <div class="card bg-base-200 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title mb-4">详细统计报告</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>总检测数</th>
                    <th>垃圾邮件</th>
                    <th>安全邮件</th>
                    <th>收藏数</th>
                    <th>垃圾邮件率</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="stat in dailyStats" :key="stat.date">
                    <td>{{ formatDate(stat.date) }}</td>
                    <td>{{ stat.total_detections }}</td>
                    <td class="text-error">{{ stat.spam_count }}</td>
                    <td class="text-success">{{ stat.normal_count }}</td>
                    <td class="text-info">{{ stat.favorite_count }}</td>
                    <td>
                      <div class="badge badge-outline">
                        {{ stat.total_detections > 0 && stat.spam_count > 0 ? ((stat.spam_count /
                          stat.total_detections) * 100).toFixed(1) + '%' : '0%' }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { getUserStatistics } from '@/api/pagesApi/statistics'
import type { UserStatisticsData } from '@/types/apis/pageApis_T'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const loading = ref(true)
const statisticsData = ref<UserStatisticsData | null>(null)

// 计算属性
const totalDetections = computed(() => statisticsData.value?.basic_stats.total_detections || 0)
const spamDetections = computed(() => statisticsData.value?.basic_stats.spam_detected || 0)
const safeDetections = computed(() => statisticsData.value?.basic_stats.normal_detected || 0)
const favoriteCount = computed(() => statisticsData.value?.basic_stats.favorite_count || 0)
const accuracyRate = computed(() => statisticsData.value?.basic_stats.accuracy_rate || 0)
const spamRate = computed(() => {
  const total = totalDetections.value
  const spam = spamDetections.value
  return total > 0 && spam > 0 ? Math.round((spam / total) * 100) : 0
})
const safeRate = computed(() => {
  const total = totalDetections.value
  const safe = safeDetections.value
  return total > 0 && safe > 0 ? Math.round((safe / total) * 100) : 0
})

const dailyStats = computed(() => statisticsData.value?.daily_stats || [])
const monthlyStats = computed(() => statisticsData.value?.monthly_stats || [])
const riskFactorsStats = computed(() => {
  // 使用API返回的risk_factors_stats数据
  if (!statisticsData.value?.risk_factors_stats) return []
  const stats = statisticsData.value.risk_factors_stats

  // 将对象转换为数组格式
  return Object.entries(stats).map(([name, value]) => ({
    name,
    value: Number(value) || 0
  }))
})

// 风险因素统计图表配置
const riskFactorsOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '风险因素',
      type: 'pie',
      radius: '50%',
      data: riskFactorsStats.value.length > 0 ? riskFactorsStats.value.map(item => ({
        value: item.value,
        name: item.name
      })) : [
        { value: 1, name: '暂无数据' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

// 检测结果分布图表配置
const resultDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    bottom: '5%',
    left: 'center'
  },
  series: [
    {
      name: '检测结果',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: (spamDetections.value > 0 || safeDetections.value > 0) ? [
        { value: spamDetections.value, name: '垃圾邮件', itemStyle: { color: '#ef4444' } },
        { value: safeDetections.value, name: '安全邮件', itemStyle: { color: '#22c55e' } }
      ] : [
        { value: 1, name: '暂无数据', itemStyle: { color: '#94a3b8' } }
      ]
    }
  ]
}))

// 检测趋势图表配置
const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['总检测数', '垃圾邮件', '安全邮件']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.month) : ['暂无数据']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总检测数',
      type: 'line',
      stack: 'Total',
      data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.total) : [0],
      itemStyle: { color: '#3b82f6' }
    },
    {
      name: '垃圾邮件',
      type: 'line',
      stack: 'Total',
      data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.spam) : [0],
      itemStyle: { color: '#ef4444' }
    },
    {
      name: '安全邮件',
      type: 'line',
      stack: 'Total',
      data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.normal) : [0],
      itemStyle: { color: '#22c55e' }
    }
  ]
}))

// 时间分布分析图表配置
const timeDistributionOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.month) : ['暂无数据']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '检测数量',
      type: 'bar',
      data: monthlyStats.value.length > 0 ? monthlyStats.value.map(item => item.total) : [0],
      itemStyle: {
        color: '#22c55e'
      }
    }
  ]
}))

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 获取统计数据
const fetchStatistics = async () => {
  try {
    loading.value = true
    const response = await getUserStatistics()
    console.log('API Response:', response);

    if (response && typeof response === 'object' && 'data' in response) {
      statisticsData.value = response.data as UserStatisticsData
    } else {
      statisticsData.value = response as UserStatisticsData
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatistics()
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
