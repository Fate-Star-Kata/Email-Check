<template>
    <div class="min-h-screen bg-base-100 text-base-content">


        <!-- 主要内容 -->
        <main class="container mx-auto px-4 py-8">
            <!-- 页面标题 -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold mb-2">历史记录</h1>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" @click="clearHistory">清空历史</button>
                    <button class="btn btn-primary" @click="exportHistory">导出记录</button>
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
                            <select class="select select-bordered" v-model="resultFilter">
                                <option value="">所有结果</option>
                                <option value="spam">垃圾邮件</option>
                                <option value="safe">安全邮件</option>
                                <option value="suspicious">可疑邮件</option>
                            </select>
                            <select class="select select-bordered" v-model="dateFilter">
                                <option value="">所有时间</option>
                                <option value="today">今天</option>
                                <option value="week">本周</option>
                                <option value="month">本月</option>
                            </select>
                            <select class="select select-bordered" v-model="sortBy">
                                <option value="date">按时间排序</option>
                                <option value="subject">按主题排序</option>
                                <option value="result">按结果排序</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 统计信息 -->
            <div class="stats shadow mb-6">
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
                    <div class="stat-value text-success">{{ safeCount }}</div>
                    <div class="stat-desc">{{ safePercentage }}% 安全率</div>
                </div>

                <div class="stat">
                    <div class="stat-title">可疑邮件</div>
                    <div class="stat-value text-warning">{{ suspiciousCount }}</div>
                    <div class="stat-desc">{{ suspiciousPercentage }}% 可疑率</div>
                </div>
            </div>

            <!-- 历史记录列表 -->
            <div class="space-y-4">
                <div v-for="record in filteredRecords" :key="record.id"
                    class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div class="card-body">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <h3 class="card-title text-lg">{{ record.subject }}</h3>
                                    <div class="badge" :class="getResultBadgeClass(record.result)">{{ record.result }}
                                    </div>
                                    <div class="badge badge-outline">{{ record.probability }}% 概率</div>
                                </div>
                                <p class="text-base-content/70 mb-2">发件人：{{ record.sender }}</p>
                                <p class="text-sm text-base-content/60 mb-3">{{ record.preview }}</p>
                                <div class="flex items-center gap-4 text-sm text-base-content/60">
                                    <span>检测时间：{{ record.checkTime }}</span>
                                    <span>检测耗时：{{ record.duration }}ms</span>
                                    <span v-if="record.isFavorite" class="text-warning">⭐ 已收藏</span>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
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
                                        <li><a @click="recheck(record)">重新检测</a></li>
                                        <li><a @click="addToFavorites(record)" v-if="!record.isFavorite">添加收藏</a></li>
                                        <li><a @click="removeFromHistory(record.id)">删除记录</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <!-- 展开的详细信息 -->
                        <div v-if="expandedRecord === record.id" class="mt-4 pt-4 border-t border-base-300">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 class="font-semibold mb-2">检测特征</h4>
                                    <div class="space-y-1">
                                        <div v-for="feature in record.features" :key="feature.name"
                                            class="flex justify-between">
                                            <span>{{ feature.name }}:</span>
                                            <span :class="getFeatureColor(feature.score)">{{ feature.value }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="font-semibold mb-2">邮件内容预览</h4>
                                    <p class="text-sm text-base-content/70 bg-base-100 p-3 rounded">{{ record.content }}
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
            <div v-if="filteredRecords.length > 0" class="flex justify-center mt-8">
                <div class="join">
                    <button class="join-item btn" :disabled="currentPage === 1" @click="currentPage--">«</button>
                    <button class="join-item btn">第 {{ currentPage }} 页</button>
                    <button class="join-item btn" :disabled="currentPage === totalPages"
                        @click="currentPage++">»</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 搜索和筛选
const searchQuery = ref('')
const resultFilter = ref('')
const dateFilter = ref('')
const sortBy = ref('date')

// 分页
const currentPage = ref(1)
const pageSize = 10

// 展开的记录
const expandedRecord = ref<number | null>(null)

// 历史记录数据
const historyRecords = ref([
    {
        id: 1,
        subject: '重要通知：系统升级',
        sender: 'admin@company.com',
        preview: '系统将于本周末进行重要升级，请提前做好数据备份...',
        content: '尊敬的用户，我们将于本周末（2024年1月20日-21日）对系统进行重要升级，届时服务可能会短暂中断。请您提前做好数据备份工作，避免造成不必要的损失。升级完成后，系统将具备更强的安全防护能力和更好的用户体验。感谢您的理解与支持！',
        result: '安全邮件',
        probability: 15,
        checkTime: '2024-01-15 14:30:25',
        duration: 1250,
        isFavorite: true,
        features: [
            { name: '关键词匹配', value: '正常', score: 0.2 },
            { name: '发件人信誉', value: '高信誉', score: 0.1 },
            { name: '链接检测', value: '安全', score: 0.1 },
            { name: '附件扫描', value: '无附件', score: 0.0 }
        ]
    },
    {
        id: 2,
        subject: '恭喜您中奖了！立即领取100万奖金',
        sender: 'lottery@fake-site.com',
        preview: '恭喜您在我们的抽奖活动中获得一等奖，奖金100万元...',
        content: '恭喜您在我们的抽奖活动中获得一等奖！您的幸运号码是：888888。请立即点击以下链接领取您的100万元奖金：http://fake-lottery-site.com/claim?id=888888。注意：此链接24小时内有效，过期作废！',
        result: '垃圾邮件',
        probability: 95,
        checkTime: '2024-01-15 10:15:42',
        duration: 890,
        isFavorite: false,
        features: [
            { name: '关键词匹配', value: '发现可疑词汇', score: 0.9 },
            { name: '发件人信誉', value: '低信誉', score: 0.8 },
            { name: '链接检测', value: '包含可疑链接', score: 0.95 },
            { name: '附件扫描', value: '无附件', score: 0.0 }
        ]
    },
    {
        id: 3,
        subject: '项目会议安排',
        sender: 'project@company.com',
        preview: '关于下周项目进度会议的时间安排通知...',
        content: '各位同事，下周一（1月22日）上午10:00将在会议室A举行项目进度会议。请各项目负责人准备好进度报告，会议预计持续2小时。如有时间冲突请提前告知。',
        result: '安全邮件',
        probability: 8,
        checkTime: '2024-01-14 16:45:18',
        duration: 1100,
        isFavorite: false,
        features: [
            { name: '关键词匹配', value: '正常', score: 0.1 },
            { name: '发件人信誉', value: '高信誉', score: 0.05 },
            { name: '链接检测', value: '无链接', score: 0.0 },
            { name: '附件扫描', value: '无附件', score: 0.0 }
        ]
    },
    {
        id: 4,
        subject: '银行账户异常，请立即验证',
        sender: 'security@bank-fake.com',
        preview: '您的银行账户出现异常登录，为了保护您的资金安全...',
        content: '尊敬的客户，我们检测到您的银行账户在异地有异常登录记录。为了保护您的资金安全，请立即点击链接验证您的身份：http://fake-bank.com/verify。如果不是您本人操作，请立即联系我们。',
        result: '垃圾邮件',
        probability: 88,
        checkTime: '2024-01-14 09:20:33',
        duration: 950,
        isFavorite: false,
        features: [
            { name: '关键词匹配', value: '发现可疑词汇', score: 0.85 },
            { name: '发件人信誉', value: '低信誉', score: 0.9 },
            { name: '链接检测', value: '包含可疑链接', score: 0.92 },
            { name: '附件扫描', value: '无附件', score: 0.0 }
        ]
    },
    {
        id: 5,
        subject: '产品推广：限时优惠',
        sender: 'marketing@shop.com',
        preview: '我们的新产品正在进行限时优惠活动，折扣高达50%...',
        content: '亲爱的客户，我们的新产品正在进行限时优惠活动！现在购买可享受5折优惠，活动仅限3天。产品质量保证，售后服务完善。点击查看详情：http://shop.com/sale',
        result: '可疑邮件',
        probability: 65,
        checkTime: '2024-01-13 14:10:15',
        duration: 1350,
        isFavorite: false,
        features: [
            { name: '关键词匹配', value: '营销词汇', score: 0.6 },
            { name: '发件人信誉', value: '中等信誉', score: 0.4 },
            { name: '链接检测', value: '正常链接', score: 0.3 },
            { name: '附件扫描', value: '无附件', score: 0.0 }
        ]
    }
])

// 计算统计信息
const totalRecords = computed(() => historyRecords.value.length)
const spamCount = computed(() => historyRecords.value.filter(r => r.result === '垃圾邮件').length)
const safeCount = computed(() => historyRecords.value.filter(r => r.result === '安全邮件').length)
const suspiciousCount = computed(() => historyRecords.value.filter(r => r.result === '可疑邮件').length)

const spamPercentage = computed(() => totalRecords.value > 0 ? Math.round((spamCount.value / totalRecords.value) * 100) : 0)
const safePercentage = computed(() => totalRecords.value > 0 ? Math.round((safeCount.value / totalRecords.value) * 100) : 0)
const suspiciousPercentage = computed(() => totalRecords.value > 0 ? Math.round((suspiciousCount.value / totalRecords.value) * 100) : 0)

// 过滤后的记录
const filteredRecords = computed(() => {
    let records = historyRecords.value

    // 按结果筛选
    if (resultFilter.value) {
        const filterMap = {
            'spam': '垃圾邮件',
            'safe': '安全邮件',
            'suspicious': '可疑邮件'
        }
        records = records.filter(record => record.result === filterMap[resultFilter.value as keyof typeof filterMap])
    }

    // 按时间筛选
    if (dateFilter.value) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        records = records.filter(record => {
            const recordDate = new Date(record.checkTime)

            switch (dateFilter.value) {
                case 'today':
                    return recordDate >= today
                case 'week':
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return recordDate >= weekAgo
                case 'month':
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                    return recordDate >= monthAgo
                default:
                    return true
            }
        })
    }

    // 按搜索查询筛选
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        records = records.filter(record =>
            record.subject.toLowerCase().includes(query) ||
            record.sender.toLowerCase().includes(query) ||
            record.content.toLowerCase().includes(query)
        )
    }

    // 排序
    records.sort((a, b) => {
        switch (sortBy.value) {
            case 'subject':
                return a.subject.localeCompare(b.subject)
            case 'result':
                return a.result.localeCompare(b.result)
            default:
                return new Date(b.checkTime).getTime() - new Date(a.checkTime).getTime()
        }
    })

    return records
})

// 总页数
const totalPages = computed(() => Math.ceil(filteredRecords.value.length / pageSize))

// 搜索历史
const searchHistory = () => {
    // 搜索逻辑已在 computed 中实现
}

// 获取结果徽章样式
const getResultBadgeClass = (result: string) => {
    switch (result) {
        case '垃圾邮件': return 'badge-error'
        case '安全邮件': return 'badge-success'
        case '可疑邮件': return 'badge-warning'
        default: return 'badge-info'
    }
}

// 获取特征颜色
const getFeatureColor = (score: number) => {
    if (score > 0.7) return 'text-error'
    if (score > 0.3) return 'text-warning'
    return 'text-success'
}

// 查看详情
const viewDetails = (record: any) => {
    if (expandedRecord.value === record.id) {
        expandedRecord.value = null
    } else {
        expandedRecord.value = record.id
    }
}

// 重新检测
const recheck = (record: any) => {
    alert(`重新检测邮件：${record.subject}`)
}

// 添加到收藏
const addToFavorites = (record: any) => {
    record.isFavorite = true
    alert(`已添加到收藏：${record.subject}`)
}

// 从历史中删除
const removeFromHistory = (recordId: number) => {
    if (confirm('确定要删除这条历史记录吗？')) {
        const index = historyRecords.value.findIndex(record => record.id === recordId)
        if (index > -1) {
            historyRecords.value.splice(index, 1)
        }
    }
}

// 清空历史
const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复！')) {
        historyRecords.value = []
    }
}

// 导出历史
const exportHistory = () => {
    alert('导出历史记录功能开发中...')
}
</script>

<style scoped>
.active {
    @apply bg-primary text-primary-content;
}
</style>
