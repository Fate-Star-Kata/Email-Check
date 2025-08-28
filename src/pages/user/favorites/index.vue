<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">收藏管理</h1>
        <p class="text-base-content/70">管理您收藏的安全邮件</p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <input type="text" s class="input input-bordered w-full" placeholder="搜索收藏的邮件..." v-model="searchQuery" />
            </div>
            <div class="flex gap-2">
              <select class="select select-bordered" v-model="filterBy">
                <option value="all">所有类型</option>
                <option value="垃圾邮件">垃圾邮件</option>
                <option value="正常邮件">正常邮件</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">总收藏</div>
          <div class="stat-value text-primary">{{ total }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">本月新增</div>
          <div class="stat-value text-secondary">{{ monthlyCount }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">垃圾邮件</div>
          <div class="stat-value text-error">{{ spamEmailCount }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">正常邮件</div>
          <div class="stat-value text-success">{{ normalEmailCount }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
      </div>

      <!-- 收藏列表 -->
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title">收藏列表</h2>
            <div class="flex gap-2">
              <button class="btn btn-outline btn-sm" @click="selectAll">
                {{ selectedItems.length === filteredFavorites.length ? '取消全选' : '全选' }}
              </button>
              <button class="btn btn-error btn-sm" @click="deleteSelected" :disabled="selectedItems.length === 0">
                删除选中 ({{ selectedItems.length }})
              </button>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-8">
            <div class="loading loading-spinner loading-lg"></div>
            <p class="mt-2">加载中...</p>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="text-center py-8">
            <div class="text-6xl mb-4">⚠️</div>
            <p class="text-lg font-medium mb-2 text-error">{{ error }}</p>
            <button class="btn btn-primary" @click="loadFavorites()">重试</button>
          </div>

          <!-- 邮件列表 -->
          <div v-else-if="filteredFavorites.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">📭</div>
            <p class="text-lg font-medium mb-2">暂无收藏邮件</p>
            <p class="text-base-content/70">开始收藏您认为重要的邮件吧</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="favorite in paginatedFavorites" :key="favorite.id"
              class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <input type="checkbox" class="checkbox checkbox-primary mt-1"
                    :checked="selectedItems.includes(favorite.id)" @change="toggleSelection(favorite.id)" />

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="font-bold text-lg truncate">{{ favorite.detection_record.email_subject }}</h3>
                      <div class="badge" :class="getResultBadgeClass(favorite.detection_record.detection_result)">{{
                        favorite.detection_record.detection_result_display }}</div>
                      <div class="badge badge-outline">{{ (favorite.detection_record.confidence_score * 100).toFixed(1)
                      }}%</div>
                    </div>

                    <div class="flex items-center gap-4 text-sm text-base-content/70 mb-2">
                      <span>发件人: {{ favorite.detection_record.email_sender }}</span>
                      <span>收藏时间: {{ formatDate(favorite.created_at) }}</span>
                      <span>检测时间: {{ formatDate(favorite.detection_record.created_at) }}</span>
                    </div>

                    <p class="text-base-content/80 line-clamp-2">{{ favorite.note || '无备注' }}</p>
                  </div>

                  <div class="flex flex-col gap-2">
                    <button class="btn btn-ghost btn-sm" @click="viewEmail(favorite)">
                      查看
                    </button>
                    <button class="btn btn-ghost btn-sm text-error" @click="removeFavorite(favorite.id)">
                      移除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="flex justify-center mt-6">
            <div class="join">
              <button class="join-item btn" :class="{ 'btn-disabled': currentPage === 1 }"
                @click="changePage(Math.max(1, currentPage - 1))">«</button>
              <button v-for="page in visiblePages" :key="page" class="join-item btn"
                :class="{ 'btn-active': page === currentPage }" @click="changePage(page)">{{ page }}</button>
              <button class="join-item btn" :class="{ 'btn-disabled': currentPage === totalPages }"
                @click="changePage(Math.min(totalPages, currentPage + 1))">»</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 查看邮件模态框 -->
    <dialog ref="viewModal" class="modal">
      <div class="modal-box w-11/12 max-w-4xl">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg mb-4">邮件详情</h3>
        <div v-if="loadingDetail" class="flex justify-center items-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
          <span class="ml-2">加载详情中...</span>
        </div>
        <div v-else-if="selectedEmail" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">主题</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.email_subject }}</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">发件人</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.email_sender }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">输入类型</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.input_type_display }}</p>
            </div>
            <div v-if="selectedEmail.file_name">
              <label class="label">
                <span class="label-text font-medium">文件名</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.file_name }}</p>
            </div>
          </div>
          <div>
            <label class="label">
              <span class="label-text font-medium">邮件内容</span>
            </label>
            <div class="p-4 bg-base-200 rounded max-h-96 overflow-y-auto">
              <p class="whitespace-pre-wrap">{{ selectedEmail.email_content }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">检测结果</span>
              </label>
              <div class="p-2 bg-base-200 rounded">
                <span class="badge"
                  :class="selectedEmail.detection_result === 'spam' ? 'badge-error' : 'badge-success'">
                  {{ selectedEmail.detection_result_display }}
                </span>
              </div>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">置信度</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ (selectedEmail.confidence_score * 100).toFixed(1) }}%</p>
            </div>
          </div>
          <div v-if="selectedEmail.risk_factors && selectedEmail.risk_factors.length > 0">
            <label class="label">
              <span class="label-text font-medium">风险因素</span>
            </label>
            <div class="p-2 bg-base-200 rounded">
              <div class="flex flex-wrap gap-2">
                <span v-for="factor in selectedEmail.risk_factors" :key="factor" class="badge badge-warning">
                  {{ factor }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="selectedEmail.user_feedback">
            <label class="label">
              <span class="label-text font-medium">用户反馈</span>
            </label>
            <p class="p-2 bg-base-200 rounded">{{ selectedEmail.user_feedback_display }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">检测时间</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ new Date(selectedEmail.created_at).toLocaleString() }}</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">更新时间</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ new Date(selectedEmail.updated_at).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getFavorites, deleteFavorite, exportFavorites } from '@/api/pagesApi/favorites'
import { getHistoryDetail } from '@/api/pagesApi/history'
import type { FavoriteRecord, FavoriteQueryParams, HistoryDetailRecord } from '@/types/apis/pageApis_T'

// 搜索和筛选
const searchQuery = ref('')
const sortBy = ref('date')
const filterBy = ref('all')

// 分页
const currentPage = ref(1)
const itemsPerPage = 5

// 选择的项目
const selectedItems = ref<number[]>([])

// 模态框引用
const viewModal = ref<HTMLDialogElement>()

// 选中的邮件详情
const selectedEmail = ref<HistoryDetailRecord | null>(null)
const loadingDetail = ref(false)

// 数据状态
const favorites = ref<FavoriteRecord[]>([])
const loading = ref(false)
const total = ref(0)
const error = ref('')

// API调用方法
const loadFavorites = async () => {
  try {
    loading.value = true
    error.value = ''

    const params: FavoriteQueryParams = {
      page: currentPage.value,
      page_size: itemsPerPage
    }

    const response = await getFavorites(params)

    if (response.code === 200 && response.data) {
      favorites.value = response.data.favorites || []
      total.value = response.data.total
    } else {
      error.value = response.msg || '获取收藏列表失败'
    }
  } catch (err: any) {
    error.value = err.message || '网络请求失败'
    console.error('获取收藏列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 计算属性
const filteredFavorites = computed(() => {
  let result = favorites.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      item.detection_record.email_subject.toLowerCase().includes(query) ||
      item.detection_record.email_sender.toLowerCase().includes(query) ||
      item.note.toLowerCase().includes(query)
    )
  }

  // 类型过滤 - 根据检测结果过滤
  if (filterBy.value !== 'all') {
    result = result.filter(item => item.detection_record.detection_result_display === filterBy.value)
  }

  return result
})

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage))

const paginatedFavorites = computed(() => {
  // 由于后端已经分页，直接返回过滤后的结果
  return filteredFavorites.value
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 统计数据
const monthlyCount = computed(() => {
  const thisMonth = new Date().getMonth()
  return favorites.value.filter(item =>
    new Date(item.created_at).getMonth() === thisMonth
  ).length
})

const spamEmailCount = computed(() =>
  favorites.value.filter(item => item.detection_record.detection_result === 'spam').length
)

const normalEmailCount = computed(() =>
  favorites.value.filter(item => item.detection_record.detection_result === 'normal').length
)

// 方法
const toggleSelection = (id: number) => {
  const index = selectedItems.value.indexOf(id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

const selectAll = () => {
  if (selectedItems.value.length === filteredFavorites.value.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = filteredFavorites.value.map(item => item.id)
  }
}

const deleteSelected = async () => {
  if (confirm(`确定要删除选中的 ${selectedItems.value.length} 个收藏吗？`)) {
    try {
      loading.value = true

      // 循环调用单个删除API
      for (const id of selectedItems.value) {
        await deleteFavorite(id)
      }

      selectedItems.value = []
      await loadFavorites() // 重新加载数据
    } catch (err: any) {
      error.value = err.message || '删除失败'
      console.error('删除收藏失败:', err)
    } finally {
      loading.value = false
    }
  }
}

const viewEmail = async (email: FavoriteRecord) => {
  try {
    loadingDetail.value = true
    selectedEmail.value = null
    viewModal.value?.showModal()

    const response = await getHistoryDetail(email.detection_record.id)
    if (response.code === 200) {
      selectedEmail.value = response.data
    } else {
      console.error('获取邮件详情失败:', response.msg)
    }
  } catch (error) {
    console.error('获取邮件详情失败:', error)
  } finally {
    loadingDetail.value = false
  }
}



const removeFavorite = async (id: number) => {
  if (confirm('确定要移除这个收藏吗？')) {
    try {
      loading.value = true
      await deleteFavorite(id)
      await loadFavorites() // 重新加载数据
    } catch (err: any) {
      error.value = err.message || '删除失败'
      console.error('删除收藏失败:', err)
    } finally {
      loading.value = false
    }
  }
}

const getResultBadgeClass = (result: string) => {
  switch (result) {
    case 'spam': return 'badge-error'
    case 'normal': return 'badge-success'
    default: return 'badge-ghost'
  }
}

// 页面切换时重新加载数据
const changePage = (page: number) => {
  currentPage.value = page
  loadFavorites()
}

// 页面初始化
onMounted(() => {
  loadFavorites()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
