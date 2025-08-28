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
              <input 
                type="text" 
                class="input input-bordered w-full" 
                placeholder="搜索收藏的邮件..."
                v-model="searchQuery"
              />
            </div>
            <div class="flex gap-2">
              <select class="select select-bordered" v-model="sortBy">
                <option value="date">按日期排序</option>
                <option value="sender">按发件人排序</option>
                <option value="subject">按主题排序</option>
              </select>
              <select class="select select-bordered" v-model="filterBy">
                <option value="all">所有类型</option>
                <option value="work">工作邮件</option>
                <option value="personal">个人邮件</option>
                <option value="newsletter">订阅邮件</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">总收藏</div>
          <div class="stat-value text-primary">{{ filteredFavorites.length }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">本月新增</div>
          <div class="stat-value text-secondary">{{ monthlyCount }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">工作邮件</div>
          <div class="stat-value text-accent">{{ workEmailCount }}</div>
          <div class="stat-desc">个邮件</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">个人邮件</div>
          <div class="stat-value text-info">{{ personalEmailCount }}</div>
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
              <button class="btn btn-primary btn-sm" @click="exportSelected" :disabled="selectedItems.length === 0">
                导出选中
              </button>
            </div>
          </div>

          <!-- 邮件列表 -->
          <div v-if="filteredFavorites.length === 0" class="text-center py-8">
            <div class="text-6xl mb-4">📭</div>
            <p class="text-lg font-medium mb-2">暂无收藏邮件</p>
            <p class="text-base-content/70">开始收藏您认为重要的邮件吧</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="favorite in paginatedFavorites" 
              :key="favorite.id" 
              class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="card-body p-4">
                <div class="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    class="checkbox checkbox-primary mt-1" 
                    :checked="selectedItems.includes(favorite.id)"
                    @change="toggleSelection(favorite.id)"
                  />
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="font-bold text-lg truncate">{{ favorite.subject }}</h3>
                      <div class="badge" :class="getTypeBadgeClass(favorite.type)">{{ favorite.type }}</div>
                      <div v-if="favorite.hasAttachment" class="badge badge-outline">📎</div>
                    </div>
                    
                    <div class="flex items-center gap-4 text-sm text-base-content/70 mb-2">
                      <span>发件人: {{ favorite.sender }}</span>
                      <span>收藏时间: {{ formatDate(favorite.favoriteDate) }}</span>
                      <span>邮件时间: {{ formatDate(favorite.emailDate) }}</span>
                    </div>
                    
                    <p class="text-base-content/80 line-clamp-2">{{ favorite.preview }}</p>
                    
                    <div v-if="favorite.tags.length > 0" class="flex gap-1 mt-2">
                      <span v-for="tag in favorite.tags" :key="tag" class="badge badge-ghost badge-sm">{{ tag }}</span>
                    </div>
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <button class="btn btn-ghost btn-sm" @click="viewEmail(favorite)">
                      查看
                    </button>
                    <button class="btn btn-ghost btn-sm" @click="editTags(favorite)">
                      标签
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
              <button 
                class="join-item btn" 
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                «
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                class="join-item btn" 
                :class="{ 'btn-active': page === currentPage }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
              <button 
                class="join-item btn" 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                »
              </button>
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
        <div v-if="selectedEmail" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text font-medium">主题</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.subject }}</p>
            </div>
            <div>
              <label class="label">
                <span class="label-text font-medium">发件人</span>
              </label>
              <p class="p-2 bg-base-200 rounded">{{ selectedEmail.sender }}</p>
            </div>
          </div>
          <div>
            <label class="label">
              <span class="label-text font-medium">邮件内容</span>
            </label>
            <div class="p-4 bg-base-200 rounded max-h-96 overflow-y-auto">
              <p class="whitespace-pre-wrap">{{ selectedEmail.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>

    <!-- 编辑标签模态框 -->
    <dialog ref="tagsModal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 class="font-bold text-lg mb-4">编辑标签</h3>
        <div v-if="editingEmail" class="space-y-4">
          <div>
            <label class="label">
              <span class="label-text">当前标签</span>
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span 
                v-for="(tag, index) in editingEmail.tags" 
                :key="index"
                class="badge badge-primary cursor-pointer"
                @click="removeTag(index)"
              >
                {{ tag }} ✕
              </span>
            </div>
          </div>
          <div>
            <label class="label">
              <span class="label-text">添加新标签</span>
            </label>
            <div class="flex gap-2">
              <input 
                type="text" 
                class="input input-bordered flex-1" 
                placeholder="输入标签名称"
                v-model="newTag"
                @keyup.enter="addTag"
              />
              <button class="btn btn-primary" @click="addTag">添加</button>
            </div>
          </div>
          <div class="modal-action">
            <button class="btn btn-primary" @click="saveTags">保存</button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// 搜索和筛选
const searchQuery = ref('')
const sortBy = ref('date')
const filterBy = ref('all')

// 分页
const currentPage = ref(1)
const itemsPerPage = 10

// 选择的项目
const selectedItems = ref<number[]>([])

// 模态框引用
const viewModal = ref<HTMLDialogElement>()
const tagsModal = ref<HTMLDialogElement>()

// 选中的邮件
const selectedEmail = ref<any>(null)
const editingEmail = ref<any>(null)
const newTag = ref('')

// 模拟收藏数据
const favorites = ref([
  {
    id: 1,
    subject: '重要项目会议通知',
    sender: 'manager@company.com',
    preview: '关于下周一的项目进度会议，请准时参加...',
    content: '亲爱的团队成员，\n\n我们将在下周一上午10点举行项目进度会议，请大家准时参加。会议将讨论当前项目的进展情况和下一步的工作安排。\n\n会议地点：会议室A\n时间：下周一上午10:00-11:30\n\n请提前准备好您的工作汇报。\n\n谢谢！',
    type: '工作邮件',
    favoriteDate: '2024-01-15',
    emailDate: '2024-01-14',
    hasAttachment: true,
    tags: ['重要', '会议']
  },
  {
    id: 2,
    subject: '生日聚会邀请',
    sender: 'friend@email.com',
    preview: '嗨！下周六是我的生日，想邀请你来参加聚会...',
    content: '嗨朋友！\n\n下周六是我的生日，想邀请你来参加聚会。我们会在我家举办一个小型聚会，有美食、音乐和游戏。\n\n时间：下周六晚上7点\n地点：我家\n\n希望你能来！请回复确认。\n\n期待见到你！',
    type: '个人邮件',
    favoriteDate: '2024-01-12',
    emailDate: '2024-01-11',
    hasAttachment: false,
    tags: ['个人', '聚会']
  },
  {
    id: 3,
    subject: '技术周报 - 第3期',
    sender: 'newsletter@techblog.com',
    preview: '本周技术热点：AI发展趋势、新框架发布...',
    content: '技术周报 - 第3期\n\n本周技术热点：\n1. AI发展趋势分析\n2. 新前端框架发布\n3. 云计算最新动态\n4. 开源项目推荐\n\n详细内容请查看附件或访问我们的网站。\n\n感谢您的订阅！',
    type: '订阅邮件',
    favoriteDate: '2024-01-10',
    emailDate: '2024-01-09',
    hasAttachment: true,
    tags: ['技术', '周报']
  },
  {
    id: 4,
    subject: '客户反馈汇总',
    sender: 'support@company.com',
    preview: '本月客户反馈汇总报告，包含满意度调查结果...',
    content: '客户反馈汇总报告\n\n本月我们收到了大量客户反馈，整体满意度达到95%。\n\n主要反馈内容：\n- 产品质量优秀\n- 服务响应及时\n- 建议增加新功能\n\n详细分析请查看附件。',
    type: '工作邮件',
    favoriteDate: '2024-01-08',
    emailDate: '2024-01-07',
    hasAttachment: true,
    tags: ['客户', '反馈', '报告']
  },
  {
    id: 5,
    subject: '旅行计划分享',
    sender: 'travel@friend.com',
    preview: '分享我的欧洲旅行计划，有兴趣一起去吗？',
    content: '嗨！\n\n我计划下个月去欧洲旅行，行程包括巴黎、罗马和巴塞罗那。\n\n具体安排：\n- 第1-3天：巴黎\n- 第4-6天：罗马\n- 第7-9天：巴塞罗那\n\n有兴趣一起去吗？费用大概每人8000元。\n\n让我知道你的想法！',
    type: '个人邮件',
    favoriteDate: '2024-01-05',
    emailDate: '2024-01-04',
    hasAttachment: false,
    tags: ['旅行', '个人']
  }
])

// 计算属性
const filteredFavorites = computed(() => {
  let result = favorites.value
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.subject.toLowerCase().includes(query) ||
      item.sender.toLowerCase().includes(query) ||
      item.preview.toLowerCase().includes(query)
    )
  }
  
  // 类型过滤
  if (filterBy.value !== 'all') {
    result = result.filter(item => item.type === filterBy.value)
  }
  
  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date':
        return new Date(b.favoriteDate).getTime() - new Date(a.favoriteDate).getTime()
      case 'sender':
        return a.sender.localeCompare(b.sender)
      case 'subject':
        return a.subject.localeCompare(b.subject)
      default:
        return 0
    }
  })
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / itemsPerPage))

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFavorites.value.slice(start, end)
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
    new Date(item.favoriteDate).getMonth() === thisMonth
  ).length
})

const workEmailCount = computed(() => 
  favorites.value.filter(item => item.type === '工作邮件').length
)

const personalEmailCount = computed(() => 
  favorites.value.filter(item => item.type === '个人邮件').length
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

const deleteSelected = () => {
  if (confirm(`确定要删除选中的 ${selectedItems.value.length} 个收藏吗？`)) {
    favorites.value = favorites.value.filter(item => !selectedItems.value.includes(item.id))
    selectedItems.value = []
  }
}

const exportSelected = () => {
  alert(`导出 ${selectedItems.value.length} 个收藏邮件`)
}

const viewEmail = (email: any) => {
  selectedEmail.value = email
  viewModal.value?.showModal()
}

const editTags = (email: any) => {
  editingEmail.value = { ...email }
  tagsModal.value?.showModal()
}

const addTag = () => {
  if (newTag.value.trim() && !editingEmail.value.tags.includes(newTag.value.trim())) {
    editingEmail.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  editingEmail.value.tags.splice(index, 1)
}

const saveTags = () => {
  const originalIndex = favorites.value.findIndex(item => item.id === editingEmail.value.id)
  if (originalIndex > -1) {
    favorites.value[originalIndex].tags = [...editingEmail.value.tags]
  }
  tagsModal.value?.close()
}

const removeFavorite = (id: number) => {
  if (confirm('确定要移除这个收藏吗？')) {
    favorites.value = favorites.value.filter(item => item.id !== id)
  }
}

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case '工作邮件': return 'badge-primary'
    case '个人邮件': return 'badge-secondary'
    case '订阅邮件': return 'badge-accent'
    default: return 'badge-ghost'
  }
}

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
