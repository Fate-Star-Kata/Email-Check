<script setup lang="ts">
import { Motion } from 'motion-v'
import { Refresh, Search, Filter, Download, Delete, View } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import type { DetectionRecord, DetectionFilter, DetectionStats, DetectionResult, ConfidenceLevel } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import DetailModal from './DetailModal.vue'

const loading = ref(false)
const tableLoading = ref(false)
const detectionRecords = ref<DetectionRecord[]>([])
const detectionStats = ref<DetectionStats>({
  todayDetections: 0,
  spamDetections: 0,
  safeDetections: 0,
  averageAccuracy: 0
})

// 筛选参数
const filterParams = reactive<DetectionFilter>({
  userQuery: '',
  detectionResult: undefined,
  confidenceLevel: undefined,
  timeRange: 'today',
  startDate: '',
  endDate: '',
  page: 1,
  pageSize: 20
})

// 分页信息
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 20
})

// 选中的记录
const selectedRecords = ref<string[]>([])

// 详情模态框
const detailModalVisible = ref(false)
const selectedRecord = ref<DetectionRecord | null>(null)

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

// 获取检测记录数据
const fetchDetectionRecords = async () => {
  tableLoading.value = true
  try {
    // TODO: 调用API获取检测记录数据
    // const response = await getDetectionRecords(filterParams)
    // detectionRecords.value = response.data.records
    // pagination.total = response.data.total
    // detectionStats.value = response.data.stats
    
    // 模拟数据
    setTimeout(() => {
      detectionRecords.value = [
        {
          id: '1',
          userId: 'user1',
          userEmail: 'test@example.com',
          userName: '张三',
          emailSubject: '重要通知',
          emailSender: 'sender@example.com',
          detectionResult: 'spam' as DetectionResult,
          confidence: 0.95,
          confidenceLevel: 'high' as ConfidenceLevel,
          detectionTime: '2024-01-15 10:30:00',
          processingTime: 150,
          riskFactors: ['可疑链接', '钓鱼内容']
        }
      ]
      detectionStats.value = {
        todayDetections: 1234,
        spamDetections: 856,
        safeDetections: 378,
        averageAccuracy: 94.5
      }
      pagination.total = 100
      tableLoading.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('获取检测记录失败')
    tableLoading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  await fetchDetectionRecords()
  loading.value = false
  ElMessage.success('数据刷新成功')
}

// 搜索
const handleSearch = () => {
  filterParams.page = 1
  pagination.currentPage = 1
  fetchDetectionRecords()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterParams, {
    userQuery: '',
    detectionResult: undefined,
    confidenceLevel: undefined,
    timeRange: 'today',
    startDate: '',
    endDate: '',
    page: 1,
    pageSize: 20
  })
  pagination.currentPage = 1
  fetchDetectionRecords()
}

// 分页变化
const handlePageChange = (page: number) => {
  filterParams.page = page
  pagination.currentPage = page
  fetchDetectionRecords()
}

// 页大小变化
const handleSizeChange = (size: number) => {
  filterParams.pageSize = size
  pagination.pageSize = size
  filterParams.page = 1
  pagination.currentPage = 1
  fetchDetectionRecords()
}

// 选择变化
const handleSelectionChange = (selection: DetectionRecord[]) => {
  selectedRecords.value = selection.map(record => record.id)
}

// 批量操作
const handleBatchAction = async (action: string) => {
  if (selectedRecords.value.length === 0) {
    ElMessage.warning('请选择要操作的记录')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要对选中的 ${selectedRecords.value.length} 条记录执行${action}操作吗？`,
      '批量操作确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用批量操作API
    ElMessage.success(`批量${action}操作成功`)
    selectedRecords.value = []
    fetchDetectionRecords()
  } catch {
    // 用户取消操作
  }
}

// 查看详情
const viewDetail = (record: DetectionRecord) => {
  selectedRecord.value = record
  detailModalVisible.value = true
}

// 获取结果标签类型
const getResultTagType = (result: DetectionResult) => {
  switch (result) {
    case 'spam': return 'danger'
    case 'safe': return 'success'
    case 'suspicious': return 'warning'
    default: return 'info'
  }
}

// 获取置信度标签类型
const getConfidenceTagType = (level: ConfidenceLevel) => {
  switch (level) {
    case 'high': return 'success'
    case 'medium': return 'warning'
    case 'low': return 'danger'
    default: return 'info'
  }
}

onMounted(() => {
  fetchDetectionRecords()
})
</script>

<template>
  <div class="detection-records">
    <!-- 统计概览 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">检测记录管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" circle @click="refreshData" />
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">今日检测</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }">
                  <p class="text-2xl font-bold text-blue-900">{{ detectionStats.todayDetections.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.3 } as any" class="text-blue-500">
                <el-icon size="32">
                  <Search />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">垃圾邮件</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }">
                  <p class="text-2xl font-bold text-red-900">{{ detectionStats.spamDetections.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.4 } as any" class="text-red-500">
                <el-icon size="32">
                  <Delete />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">安全邮件</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-green-900">{{ detectionStats.safeDetections.toLocaleString() }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-green-500">
                <el-icon size="32">
                  <View />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">平均准确率</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-purple-900">{{ detectionStats.averageAccuracy }}%</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-purple-500">
                <el-icon size="32">
                  <TrendCharts />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 筛选区域 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.6 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">高级筛选</span>
            <el-button type="text" @click="resetFilter">重置</el-button>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <el-input
            v-model="filterParams.userQuery"
            placeholder="搜索用户邮箱或姓名"
            :prefix-icon="Search"
            clearable
          />
          
          <el-select v-model="filterParams.detectionResult" placeholder="检测结果" clearable>
            <el-option label="垃圾邮件" value="spam" />
            <el-option label="安全邮件" value="safe" />
            <el-option label="可疑邮件" value="suspicious" />
          </el-select>
          
          <el-select v-model="filterParams.confidenceLevel" placeholder="置信度等级" clearable>
            <el-option label="高置信度" value="high" />
            <el-option label="中等置信度" value="medium" />
            <el-option label="低置信度" value="low" />
          </el-select>
          
          <el-select v-model="filterParams.timeRange" placeholder="时间范围">
            <el-option label="今天" value="today" />
            <el-option label="本周" value="week" />
            <el-option label="本月" value="month" />
            <el-option label="本季度" value="quarter" />
            <el-option label="本年" value="year" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Filter" @click="resetFilter">重置</el-button>
          </div>
          
          <div class="flex items-center space-x-2">
            <el-button 
              type="success" 
              :icon="Download" 
              :disabled="selectedRecords.length === 0"
              @click="handleBatchAction('导出')"
            >
              批量导出
            </el-button>
            <el-button 
              type="danger" 
              :icon="Delete" 
              :disabled="selectedRecords.length === 0"
              @click="handleBatchAction('删除')"
            >
              批量删除
            </el-button>
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 数据表格 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">检测记录列表</span>
            <span class="text-sm text-gray-500">共 {{ pagination.total }} 条记录</span>
          </div>
        </template>

        <el-table
          :data="detectionRecords"
          :loading="tableLoading"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
          <el-table-column prop="userEmail" label="用户邮箱" min-width="180">
            <template #default="{ row }">
              <div>
                <div class="font-medium">{{ row.userEmail }}</div>
                <div class="text-sm text-gray-500">{{ row.userName }}</div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="emailSubject" label="邮件主题" min-width="200" show-overflow-tooltip />
          
          <el-table-column prop="emailSender" label="发件人" min-width="150" show-overflow-tooltip />
          
          <el-table-column prop="detectionResult" label="检测结果" width="120">
            <template #default="{ row }">
              <el-tag :type="getResultTagType(row.detectionResult)" size="small">
                {{ row.detectionResult === 'spam' ? '垃圾邮件' : 
                   row.detectionResult === 'safe' ? '安全邮件' : '可疑邮件' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="confidence" label="置信度" width="120">
            <template #default="{ row }">
              <div class="flex items-center space-x-2">
                <el-progress 
                  :percentage="Math.round(row.confidence * 100)" 
                  :stroke-width="6" 
                  :show-text="false"
                  :color="row.confidence >= 0.8 ? '#67C23A' : row.confidence >= 0.6 ? '#E6A23C' : '#F56C6C'"
                />
                <span class="text-sm">{{ Math.round(row.confidence * 100) }}%</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="confidenceLevel" label="置信度等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getConfidenceTagType(row.confidenceLevel)" size="small">
                {{ row.confidenceLevel === 'high' ? '高' : 
                   row.confidenceLevel === 'medium' ? '中' : '低' }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="detectionTime" label="检测时间" width="160" />
          
          <el-table-column prop="processingTime" label="处理时间" width="100">
            <template #default="{ row }">
              {{ row.processingTime }}ms
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" :icon="View" @click="viewDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </Motion>

    <!-- 详情模态框 -->
    <DetailModal 
      v-model:visible="detailModalVisible"
      :record="selectedRecord"
      @refresh="fetchDetectionRecords"
    />
  </div>
</template>

<style scoped>
.detection-records {
  width: 100%;
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

/* 表格样式优化 */
.el-table {
  border-radius: 8px;
}

.el-progress {
  width: 60px;
}
</style>