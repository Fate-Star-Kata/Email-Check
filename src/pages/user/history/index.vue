<template>
    <div class="min-h-screen bg-base-100 text-base-content">
        <!-- 主要内容 -->
        <main class="container mx-auto px-4 py-8">
            <!-- 页面标题 -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold mb-2">历史记录</h1>
                </div>
            </div>

            <!-- 筛选和搜索 -->
            <div class="card bg-base-200 shadow-sm mb-6">
                <div class="card-body">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <div class="join w-full">
                                <input class="input input-bordered join-item flex-1" placeholder="搜索历史记录（主题、发件人、内容）"
                                    v-model="searchQuery" />
                                <button class="btn btn-primary join-item" @click="searchHistory">搜索</button>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <select class="select select-bordered" v-model="resultFilter" @change="handleFilterChange">
                                <option value="">所有结果</option>
                                <option value="spam">垃圾邮件</option>
                                <option value="legitimate">安全邮件</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 统计信息 -->
            <div class="stats shadow mb-6 w-full">
                <div class="stat">
                    <div class="stat-title">总检测次数</div>
                    <div class="stat-value">{{ totalRecords }}</div>
                    <div class="stat-desc">历史记录总数</div>
                </div>

                <div class="stat">
                    <div class="stat-title">垃圾邮件</div>
                    <div class="stat-value text-error">{{ spamCount }}</div>
                    <div class="stat-desc">{{ spamPercentage }}% 检出率</div>
                </div>

                <div class="stat">
                    <div class="stat-title">安全邮件</div>
                    <div class="stat-value text-success">{{ legitimateCount }}</div>
                    <div class="stat-desc">{{ legitimatePercentage }}% 安全率</div>
                </div>

                <div class="stat">
                    <div class="stat-title">可疑邮件</div>
                    <div class="stat-value text-warning">{{ suspiciousCount }}</div>
                    <div class="stat-desc">{{ suspiciousPercentage }}% 可疑率</div>
                </div>
            </div>

            <!-- 历史记录列表 -->
            <!-- 加载状态 -->
            <div v-if="loading" class="flex justify-center items-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
                <span class="ml-2">加载中...</span>
            </div>

            <div v-else class="space-y-4">
                <div v-for="record in filteredRecords" :key="record.id"
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div class="card-body">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h3 class="card-title text-lg">{{ record.subject }}</h3>
                                    <div class="badge" :class="getResultBadgeClass(record.detection_result)">
                                        {{ record.detection_result === 'spam' ? '垃圾邮件' : '安全邮件' }}
                                    </div>
                                    <div class="badge badge-outline">{{ Math.round(record.confidence_score * 100) }}% 概率
                                    </div>
                                </div>
                                <p class="text-base-content/70 mb-2">发件人：{{ record.sender_email }}</p>
                                <p class="text-sm text-base-content/60 mb-3">{{ record.email_content.substring(0, 100)
                                    }}...</p>
                                <div class="flex items-center gap-4 text-sm text-base-content/60">
                                    <span>检测时间：{{ formatDate(record.created_at) }}</span>
                                    <span v-if="record.isFavorite" class="text-warning">⭐ 已收藏</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <!-- 收藏按钮 -->
                                <button class="btn btn-ghost btn-sm"
                                    :class="record.isFavorite ? 'text-warning' : 'text-base-content/60'"
                                    @click="toggleFavorite(record)" :title="record.isFavorite ? '取消收藏' : '添加收藏'">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        :fill="record.isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24"
                                        stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>

                                <div class="dropdown dropdown-end">
                                    <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            class="w-4 h-4 stroke-current">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                                            </path>
                                        </svg>
                                    </div>
                                    <ul tabindex="0"
                                        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a @click="viewDetails(record)">查看详情</a></li>
                                        <li><a @click="removeFromHistory(record.id)">删除记录</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- 展开的详细信息 -->
                        <div v-if="expandedRecord === record.id" class="mt-4 pt-4 border-t border-base-300">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 class="font-semibold mb-2">检测信息</h4>
                                    <div class="space-y-1">
                                        <div class="flex justify-between">
                                            <span>检测结果:</span>
                                            <span
                                                :class="record.detection_result === 'spam' ? 'text-error' : 'text-success'">
                                                {{ record.detection_result === 'spam' ? '垃圾邮件' : '安全邮件' }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>置信度:</span>
                                            <span>{{ Math.round(record.confidence_score * 100) }}%</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>检测时间:</span>
                                            <span>{{ formatDate(record.created_at) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-semibold mb-2">邮件内容预览</h4>
                                    <p class="text-sm text-base-content/70 bg-base-100 p-3 rounded">{{
                                        record.email_content }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <div v-if="filteredRecords.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">📋</div>
                <h3 class="text-xl font-semibold mb-2">暂无历史记录</h3>
                <p class="text-base-content/70">开始检测邮件来创建历史记录吧！</p>
            </div>

            <!-- 分页 -->
            <div v-if="!loading && totalPages > 1" class="flex justify-center mt-6">
                <div class="join">
                    <button class="join-item btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                        «
                    </button>
                    <button class="join-item btn" v-for="page in Math.min(totalPages, 5)" :key="page"
                        :class="{ 'btn-active': page === currentPage }" @click="changePage(page)">
                        {{ page }}
                    </button>
                    <button class="join-item btn" :disabled="currentPage === totalPages"
                        @click="changePage(currentPage + 1)">
                        »
                    </button>
                </div>
                <div class="ml-4 flex items-center text-sm text-gray-500">
                    共 {{ totalRecords }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
                </div>
            </div>
        </main>
    </div>

    <!-- 详情模态框 -->
    <div v-if="showDetailModal" class="modal modal-open">
        <div class="modal-box max-w-4xl">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-lg">检测记录详情</h3>
                <button class="btn btn-sm btn-circle btn-ghost" @click="closeDetailModal">
                    ✕
                </button>
            </div>

            <div v-if="detailLoading" class="flex justify-center py-8">
                <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else-if="detailRecord" class="space-y-6">
                <!-- 基本信息 -->
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">基本信息</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">邮件主题</span>
                                </label>
                                <p class="text-sm bg-base-100 p-2 rounded">{{ detailRecord.email_subject }}</p>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">发件人</span>
                                </label>
                                <p class="text-sm bg-base-100 p-2 rounded">{{ detailRecord.email_sender }}</p>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">输入方式</span>
                                </label>
                                <p class="text-sm bg-base-100 p-2 rounded">{{ detailRecord.input_type_display }}</p>
                            </div>
                            <div v-if="detailRecord.file_name">
                                <label class="label">
                                    <span class="label-text font-semibold">文件名</span>
                                </label>
                                <p class="text-sm bg-base-100 p-2 rounded">{{ detailRecord.file_name }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 检测结果 -->
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">检测结果</h4>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">检测结果</span>
                                </label>
                                <div class="badge"
                                    :class="detailRecord.detection_result === 'spam' ? 'badge-error' : 'badge-success'">
                                    {{ detailRecord.detection_result_display }}
                                </div>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">置信度</span>
                                </label>
                                <div class="badge badge-outline">
                                    {{ Math.round(detailRecord.confidence_score * 100) }}%
                                </div>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">检测时间</span>
                                </label>
                                <p class="text-sm">{{ formatDate(detailRecord.created_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 邮件内容 -->
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">邮件内容</h4>
                        <div class="bg-base-100 p-4 rounded max-h-60 overflow-y-auto">
                            <pre class="whitespace-pre-wrap text-sm">{{ detailRecord.email_content }}</pre>
                        </div>
                    </div>
                </div>

                <!-- 风险因素 -->
                <div v-if="detailRecord.risk_factors && detailRecord.risk_factors.length > 0" class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">风险因素</h4>
                        <div class="space-y-2">
                            <div v-for="(factor, index) in detailRecord.risk_factors" :key="index"
                                class="badge badge-warning badge-outline">
                                {{ factor }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 用户反馈 -->
                <div v-if="detailRecord.user_feedback" class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">用户反馈</h4>
                        <p class="text-sm bg-base-100 p-2 rounded">{{ detailRecord.user_feedback_display ||
                            detailRecord.user_feedback }}</p>
                    </div>
                </div>

                <!-- 时间信息 -->
                <div class="card bg-base-200">
                    <div class="card-body">
                        <h4 class="card-title text-base">时间信息</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">创建时间</span>
                                </label>
                                <p class="text-sm">{{ formatDate(detailRecord.created_at) }}</p>
                            </div>
                            <div>
                                <label class="label">
                                    <span class="label-text font-semibold">更新时间</span>
                                </label>
                                <p class="text-sm">{{ formatDate(detailRecord.updated_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button class="btn" @click="closeDetailModal">关闭</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDetectionHistory, getHistoryDetail, deleteHistoryRecord, addFavorite, removeFavoriteByRecordId } from '@/api/pagesApi/history'
import type { HistoryRecord, HistoryDetailRecord, HistoryQueryParams, AddFavoriteRequest } from '@/types/apis/pageApis_T'

// 筛选条件
const searchQuery = ref('')
const resultFilter = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(5)
const totalRecords = ref(0)

// 展开的记录
const expandedRecord = ref<number | null>(null)

// 详情数据
const detailRecord = ref<HistoryDetailRecord | null>(null)
const showDetailModal = ref(false)
const detailLoading = ref(false)

// 加载状态
const loading = ref(false)

// 历史记录数据
const historyRecords = ref<HistoryRecord[]>([])

// 组件挂载时获取数据
onMounted(() => {
    fetchHistoryRecords()
})

// 获取历史记录
const fetchHistoryRecords = async () => {
    try {
        loading.value = true
        const params: HistoryQueryParams = {
            page: currentPage.value,
            page_size: pageSize.value
        }

        // 添加筛选条件
        if (resultFilter.value) {
            params.result = resultFilter.value as 'spam' | 'legitimate'
        }



        const response = await getDetectionHistory(params)
        if (response.code === 200) {
            // 映射后端数据字段到前端期望的格式
            historyRecords.value = response.data.records.map((record: any) => ({
                id: record.id,
                subject: record.email_subject,
                sender_email: record.email_sender,
                email_content: record.email_content || '',
                detection_result: record.detection_result === 'normal' ? 'legitimate' : record.detection_result,
                confidence_score: record.confidence_score,
                created_at: record.created_at,
                isFavorite: record.is_favorited || false // 使用后端的is_favorited字段
            }))
            totalRecords.value = response.data.total
        } else {
            console.error('获取历史记录失败:', response.msg)
        }
    } catch (error) {
        console.error('获取历史记录出错:', error)
    } finally {
        loading.value = false
    }
}

// 计算统计信息
const spamCount = computed(() => historyRecords.value?.filter(record => record.detection_result === 'spam').length || 0)
const legitimateCount = computed(() => historyRecords.value?.filter(record => record.detection_result === 'legitimate').length || 0)
const suspiciousCount = computed(() => 0) // API中暂无可疑邮件分类

const spamPercentage = computed(() => totalRecords.value > 0 ? Math.round((spamCount.value / totalRecords.value) * 100) : 0)
const legitimatePercentage = computed(() => totalRecords.value > 0 ? Math.round((legitimateCount.value / totalRecords.value) * 100) : 0)
const suspiciousPercentage = computed(() => totalRecords.value > 0 ? Math.round((suspiciousCount.value / totalRecords.value) * 100) : 0)

// 过滤后的记录（现在主要用于前端搜索，筛选通过API参数处理）
const filteredRecords = computed(() => {
    let records = historyRecords.value || []

    // 前端搜索过滤（对当前页面数据进行搜索）
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        records = records.filter(record =>
            record.subject.toLowerCase().includes(query) ||
            record.sender_email.toLowerCase().includes(query) ||
            record.email_content.toLowerCase().includes(query)
        )
    }

    // 按时间倒序排序
    records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return records
})

// 总页数
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

// 切换页面
const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchHistoryRecords() // 重新获取数据
    }
}

// 筛选变化时重新获取数据
const handleFilterChange = () => {
    currentPage.value = 1 // 重置到第一页
    fetchHistoryRecords()
}

// 搜索历史（前端搜索，不需要重新请求API）
const searchHistory = () => {
    // 前端搜索不需要重置页面，因为是对当前数据的过滤
}

// 获取结果徽章样式
const getResultBadgeClass = (result: string) => {
    switch (result) {
        case 'spam': return 'badge-error'
        case 'legitimate': return 'badge-success'
        case 'suspicious': return 'badge-warning'
        default: return 'badge-info'
    }
}

// 格式化日期
const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 获取特征颜色
const getFeatureColor = (score: number) => {
    if (score > 0.7) return 'text-error'
    if (score > 0.3) return 'text-warning'
    return 'text-success'
}

// 查看详情
const viewDetails = async (record: HistoryRecord) => {
    try {
        detailLoading.value = true
        showDetailModal.value = true

        const response = await getHistoryDetail(record.id)
        if (response.code === 200) {
            detailRecord.value = response.data
        } else {
            console.error('获取详情失败:', response.msg)
        }
    } catch (error) {
        console.error('获取详情出错:', error)
    } finally {
        detailLoading.value = false
    }
}

// 关闭详情模态框
const closeDetailModal = () => {
    showDetailModal.value = false
    detailRecord.value = null
}

// 切换收藏状态
const toggleFavorite = async (record: HistoryRecord) => {
    try {
        if (record.isFavorite) {
            // 取消收藏逻辑
            const response = await removeFavoriteByRecordId(record.id)
            if (response.code === 200) {
                record.isFavorite = false
                console.log('已从收藏中移除')
                // 重新获取数据以确保状态同步
                await fetchHistoryRecords()
            } else {
                console.error('移除收藏失败:', response.msg)
                alert('移除收藏失败: ' + response.msg)
            }
        } else {
            // 添加收藏逻辑
            const favoriteData: AddFavoriteRequest = {
                record_id: record.id,
            }

            const response = await addFavorite(favoriteData)
            if (response.code === 200) {
                // 更新本地状态
                record.isFavorite = true
                console.log('添加收藏成功')
                // 重新获取数据以确保状态同步
                await fetchHistoryRecords()
            } else {
                console.error('添加收藏失败:', response.msg)
                alert('添加收藏失败: ' + response.msg)
            }
        }
    } catch (error) {
        console.error('收藏操作出错:', error)
        alert('收藏操作失败，请稍后重试')
    }
}

// 从历史中删除
const removeFromHistory = async (recordId: number) => {
    if (confirm('确定要删除这条历史记录吗？')) {
        try {
            const response = await deleteHistoryRecord(recordId)
            if (response.code === 200) {
                console.log('删除记录成功')
                // 重新获取数据
                await fetchHistoryRecords()
            } else {
                console.error('删除记录失败:', response.msg)
                alert('删除失败: ' + response.msg)
            }
        } catch (error) {
            console.error('删除记录出错:', error)
            alert('删除失败，请稍后重试')
        }
    }
}

</script>

<style scoped>
.active {
    @apply bg-primary text-primary-content;
}
</style>
