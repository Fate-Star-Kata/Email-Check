hhhh
<script setup lang="ts">
import { Motion } from 'motion-v'
import { Refresh, Search, Filter, Warning, User, TrendCharts, Monitor } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import type { RiskUser, RiskUserFilter, RiskLevelStats, RiskLevel, UserStatus, AnalysisType } from '@/types/factory'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserDetailModal from './UserDetailModal.vue'

const loading = ref(false)
const tableLoading = ref(false)
const riskUsers = ref<RiskUser[]>([])
const riskStats = ref<RiskLevelStats>({
  highRisk: 0,
  mediumRisk: 0,
  lowRisk: 0,
  totalRisk: 0,
  riskPercentage: 0
})

// 筛选参数
const filterParams = reactive<RiskUserFilter>({
  searchQuery: '',
  riskLevel: undefined,
  status: undefined,
  sortBy: 'riskScore',
  sortOrder: 'desc',
  page: 1,
  pageSize: 20
})

// 分页信息
const pagination = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 20
})

// 选中的用户
const selectedUsers = ref<string[]>([])

// 用户详情模态框
const userDetailModalVisible = ref(false)
const selectedUser = ref<RiskUser | null>(null)

// 风险分析参数
const analysisParams = reactive({
  analysisType: 'behavior' as AnalysisType,
  timeRange: '30days' as '7days' | '30days' | '90days' | '1year',
  riskThreshold: 70
})

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

// 获取风险用户数据
const fetchRiskUsers = async () => {
  tableLoading.value = true
  try {
    // TODO: 调用API获取风险用户数据
    // const response = await getRiskUsers(filterParams)
    // riskUsers.value = response.data.users
    // pagination.total = response.data.total
    // riskStats.value = response.data.stats

    // 模拟数据
    setTimeout(() => {
      riskUsers.value = [
        {
          id: '1',
          userId: 'user1',
          email: 'risk@example.com',
          name: '张三',
          riskLevel: 'high' as RiskLevel,
          riskScore: 85,
          riskFactors: ['频繁发送垃圾邮件', '可疑行为模式'],
          detectionCount: 156,
          spamRate: 0.78,
          lastActivity: '2024-01-15 10:30:00',
          status: 'monitoring' as UserStatus,
          createdAt: '2024-01-01 00:00:00',
          updatedAt: '2024-01-15 10:30:00'
        }
      ]
      riskStats.value = {
        highRisk: 45,
        mediumRisk: 123,
        lowRisk: 67,
        totalRisk: 235,
        riskPercentage: 12.5
      }
      pagination.total = 235
      tableLoading.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('获取风险用户数据失败')
    tableLoading.value = false
  }
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  await fetchRiskUsers()
  loading.value = false
  ElMessage.success('数据刷新成功')
}

// 搜索
const handleSearch = () => {
  filterParams.page = 1
  pagination.currentPage = 1
  fetchRiskUsers()
}

// 重置筛选
const resetFilter = () => {
  Object.assign(filterParams, {
    searchQuery: '',
    riskLevel: undefined,
    status: undefined,
    sortBy: 'riskScore',
    sortOrder: 'desc',
    page: 1,
    pageSize: 20
  })
  pagination.currentPage = 1
  fetchRiskUsers()
}

// 分页变化
const handlePageChange = (page: number) => {
  filterParams.page = page
  pagination.currentPage = page
  fetchRiskUsers()
}

// 页大小变化
const handleSizeChange = (size: number) => {
  filterParams.pageSize = size
  pagination.pageSize = size
  filterParams.page = 1
  pagination.currentPage = 1
  fetchRiskUsers()
}

// 选择变化
const handleSelectionChange = (selection: RiskUser[]) => {
  selectedUsers.value = selection.map(user => user.id)
}

// 批量风险管理
const handleBatchRiskManagement = async (action: string) => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要操作的用户')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要对选中的 ${selectedUsers.value.length} 个用户执行${action}操作吗？`,
      '批量操作确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用批量风险管理API
    ElMessage.success(`批量${action}操作成功`)
    selectedUsers.value = []
    fetchRiskUsers()
  } catch {
    // 用户取消操作
  }
}

// 风险分析
const performRiskAnalysis = async () => {
  try {
    loading.value = true
    // TODO: 调用风险分析API
    // const response = await performRiskAnalysis(analysisParams)

    setTimeout(() => {
      loading.value = false
      ElMessage.success('风险分析完成')
      fetchRiskUsers()
    }, 2000)
  } catch (error) {
    loading.value = false
    ElMessage.error('风险分析失败')
  }
}

// 查看用户详情
const viewUserDetail = (user: RiskUser) => {
  selectedUser.value = user
  userDetailModalVisible.value = true
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

// 获取风险分数颜色
const getRiskScoreColor = (score: number) => {
  if (score >= 80) return '#F56C6C'
  if (score >= 60) return '#E6A23C'
  return '#67C23A'
}

onMounted(() => {
  fetchRiskUsers()
})
</script>

<template>
  <div class="risk-users">
    <!-- 风险等级概览 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">风险用户识别</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.3 }">
              <el-button type="primary" :icon="Refresh" :loading="loading" circle @click="refreshData" />
            </Motion>
          </div>
        </template>

        <!-- 风险统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-red-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-600 text-sm font-medium">高风险用户</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }">
                  <p class="text-2xl font-bold text-red-900">{{ riskStats.highRisk }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.3 } as any" class="text-red-500">
                <el-icon size="32">
                  <Warning />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">中风险用户</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ riskStats.mediumRisk }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.4 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <Monitor />
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
                <p class="text-green-600 text-sm font-medium">低风险用户</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-green-900">{{ riskStats.lowRisk }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-green-500">
                <el-icon size="32">
                  <User />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总风险用户</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-blue-900">{{ riskStats.totalRisk }}</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-blue-500">
                <el-icon size="32">
                  <TrendCharts />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">风险占比</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-2xl font-bold text-purple-900">{{ riskStats.riskPercentage }}%</p>
                </Motion>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-purple-500">
                <el-icon size="32">
                  <TrendCharts />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 分析工具 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.7 } as any">
      <el-card class="mb-6">
        <template #header>
          <span class="font-medium">风险分析工具</span>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <el-select v-model="analysisParams.analysisType" placeholder="分析类型">
            <el-option label="行为分析" value="behavior" />
            <el-option label="模式分析" value="pattern" />
            <el-option label="频率分析" value="frequency" />
            <el-option label="内容分析" value="content" />
          </el-select>

          <el-select v-model="analysisParams.timeRange" placeholder="时间范围">
            <el-option label="最近7天" value="7days" />
            <el-option label="最近30天" value="30days" />
            <el-option label="最近90天" value="90days" />
            <el-option label="最近1年" value="1year" />
          </el-select>

          <el-slider v-model="analysisParams.riskThreshold" :min="0" :max="100" :step="5" show-input input-size="small"
            style="margin-top: 8px;" />

          <el-button type="primary" :loading="loading" @click="performRiskAnalysis">
            开始分析
          </el-button>
        </div>
      </el-card>
    </Motion>

    <!-- 筛选搜索 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">筛选搜索</span>
            <el-button type="text" @click="resetFilter">重置</el-button>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <el-input v-model="filterParams.searchQuery" placeholder="搜索用户邮箱或姓名" :prefix-icon="Search" clearable />

          <el-select v-model="filterParams.riskLevel" placeholder="风险等级" clearable>
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
            <el-option label="低风险" value="low" />
          </el-select>

          <el-select v-model="filterParams.status" placeholder="用户状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="监控中" value="monitoring" />
            <el-option label="受限" value="restricted" />
            <el-option label="暂停" value="suspended" />
          </el-select>

          <el-select v-model="filterParams.sortBy" placeholder="排序方式">
            <el-option label="风险分数" value="riskScore" />
            <el-option label="最后活动" value="lastActivity" />
            <el-option label="检测次数" value="detectionCount" />
          </el-select>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="Filter" @click="resetFilter">重置</el-button>
          </div>

          <div class="flex items-center space-x-2">
            <el-button type="warning" :disabled="selectedUsers.length === 0" @click="handleBatchRiskManagement('监控')">
              批量监控
            </el-button>
            <el-button type="danger" :disabled="selectedUsers.length === 0" @click="handleBatchRiskManagement('限制')">
              批量限制
            </el-button>
          </div>
        </div>
      </el-card>
    </Motion>

    <!-- 用户列表 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.9 } as any">
      <el-card>
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-medium">风险用户列表</span>
            <span class="text-sm text-gray-500">共 {{ pagination.total }} 个风险用户</span>
          </div>
        </template>

        <el-table :data="riskUsers" :loading="tableLoading" @selection-change="handleSelectionChange" stripe
          style="width: 100%">
          <el-table-column type="selection" width="55" />

          <el-table-column prop="email" label="用户信息" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center space-x-3">
                <el-avatar :size="40" :src="row.avatar">
                  {{ row.name.charAt(0) }}
                </el-avatar>
                <div>
                  <div class="font-medium">{{ row.name }}</div>
                  <div class="text-sm text-gray-500">{{ row.email }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="riskLevel" label="风险等级" width="120">
            <template #default="{ row }">
              <el-tag :type="getRiskLevelTagType(row.riskLevel)" size="small">
                {{ row.riskLevel === 'high' ? '高风险' :
                  row.riskLevel === 'medium' ? '中风险' : '低风险' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="riskScore" label="风险分数" width="150">
            <template #default="{ row }">
              <div class="flex items-center space-x-2">
                <el-progress :percentage="row.riskScore" :stroke-width="8" :show-text="false"
                  :color="getRiskScoreColor(row.riskScore)" />
                <span class="text-sm font-medium">{{ row.riskScore }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="riskFactors" label="风险因素" min-width="200">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1">
                <el-tag v-for="factor in row.riskFactors.slice(0, 2)" :key="factor" size="small" type="warning">
                  {{ factor }}
                </el-tag>
                <el-tag v-if="row.riskFactors.length > 2" size="small" type="info">
                  +{{ row.riskFactors.length - 2 }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="detectionCount" label="检测次数" width="100" />

          <el-table-column prop="spamRate" label="垃圾邮件率" width="120">
            <template #default="{ row }">
              <span :class="{
                'text-red-600': row.spamRate >= 0.7,
                'text-yellow-600': row.spamRate >= 0.4 && row.spamRate < 0.7,
                'text-green-600': row.spamRate < 0.4
              }">
                {{ Math.round(row.spamRate * 100) }}%
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getUserStatusTagType(row.status)" size="small">
                {{ row.status === 'active' ? '活跃' :
                  row.status === 'monitoring' ? '监控' :
                    row.status === 'restricted' ? '受限' : '暂停' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="lastActivity" label="最后活动" width="160" />

          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="viewUserDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="flex justify-center mt-6">
          <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
      </el-card>
    </Motion>

    <!-- 用户详情模态框 -->
    <UserDetailModal v-model:visible="userDetailModalVisible" :user="selectedUser" @refresh="fetchRiskUsers" />
  </div>
</template>

<style scoped>
.risk-users {
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
  width: 80px;
}

/* 用户头像样式 */
.el-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}
</style>