<template>
  <div class="min-h-screen bg-base-100 text-base-content">


    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-2">邮件收藏</h1>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" @click="showAddCategoryModal = true">添加分类</button>
          <button class="btn btn-outline" @click="exportFavorites">导出收藏</button>
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="tabs tabs-boxed mb-6">
        <a 
          v-for="category in categories" 
          :key="category.id"
          class="tab" 
          :class="{ 'tab-active': activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          {{ category.name }} ({{ category.count }})
        </a>
      </div>

      <!-- 搜索和筛选 -->
      <div class="card bg-base-200 shadow-sm mb-6">
        <div class="card-body">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <div class="join w-full">
                <input 
                  class="input input-bordered join-item flex-1" 
                  placeholder="搜索收藏邮件（主题、发件人）"
                  v-model="searchQuery"
                />
                <button class="btn btn-primary join-item" @click="searchFavorites">搜索</button>
              </div>
            </div>
            <div class="flex gap-2">
              <select class="select select-bordered" v-model="sortBy">
                <option value="date">按日期排序</option>
                <option value="subject">按主题排序</option>
                <option value="sender">按发件人排序</option>
              </select>
              <select class="select select-bordered" v-model="sortOrder">
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 收藏邮件列表 -->
      <div class="space-y-4">
        <div 
          v-for="email in filteredEmails" 
          :key="email.id"
          class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="card-body">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="card-title text-lg">{{ email.subject }}</h3>
                  <div class="badge" :class="getCategoryBadgeClass(email.category)">{{ email.categoryName }}</div>
                </div>
                <p class="text-base-content/70 mb-2">发件人：{{ email.sender }}</p>
                <p class="text-sm text-base-content/60 mb-3">{{ email.preview }}</p>
                <div class="flex items-center gap-4 text-sm text-base-content/60">
                  <span>收藏时间：{{ email.favoriteDate }}</span>
                  <span>检测结果：
                    <span :class="getResultColor(email.result)">{{ email.result }}</span>
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="dropdown dropdown-end">
                  <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                    </svg>
                  </div>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a @click="viewEmail(email)">查看详情</a></li>
                    <li><a @click="editCategory(email)">修改分类</a></li>
                    <li><a @click="removeFromFavorites(email.id)">移除收藏</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredEmails.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-xl font-semibold mb-2">暂无收藏邮件</h3>
        <p class="text-base-content/70">开始检测邮件并添加收藏吧！</p>
      </div>
    </main>

    <!-- 添加分类模态框 -->
    <dialog class="modal" :class="{ 'modal-open': showAddCategoryModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">添加新分类</h3>
        <div class="form-control">
          <label class="label">
            <span class="label-text">分类名称</span>
          </label>
          <input 
            type="text" 
            placeholder="请输入分类名称" 
            class="input input-bordered w-full"
            v-model="newCategoryName"
          />
        </div>
        <div class="modal-action">
          <button class="btn" @click="showAddCategoryModal = false">取消</button>
          <button class="btn btn-primary" @click="addCategory">添加</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', count: 45 },
  { id: 'important', name: '重要', count: 12 },
  { id: 'work', name: '工作', count: 18 },
  { id: 'personal', name: '个人', count: 15 }
])

// 当前活动分类
const activeCategory = ref('all')

// 搜索查询
const searchQuery = ref('')

// 排序选项
const sortBy = ref('date')
const sortOrder = ref('desc')

// 模态框状态
const showAddCategoryModal = ref(false)
const newCategoryName = ref('')

// 收藏邮件数据
const favoriteEmails = ref([
  {
    id: 1,
    subject: '重要工作通知',
    sender: 'boss@company.com',
    preview: '关于下周项目会议的重要通知，请务必参加...',
    category: 'important',
    categoryName: '重要',
    favoriteDate: '2024-01-15 14:30',
    result: '安全邮件'
  },
  {
    id: 2,
    subject: '项目进度报告',
    sender: 'team@company.com',
    preview: '本周项目进度总结和下周计划安排...',
    category: 'work',
    categoryName: '工作',
    favoriteDate: '2024-01-14 09:15',
    result: '安全邮件'
  },
  {
    id: 3,
    subject: '生日聚会邀请',
    sender: 'friend@email.com',
    preview: '诚挚邀请您参加我的生日聚会，时间是...',
    category: 'personal',
    categoryName: '个人',
    favoriteDate: '2024-01-13 16:45',
    result: '安全邮件'
  },
  {
    id: 4,
    subject: '系统维护通知',
    sender: 'admin@system.com',
    preview: '系统将于本周末进行维护升级，请提前做好准备...',
    category: 'important',
    categoryName: '重要',
    favoriteDate: '2024-01-12 11:20',
    result: '安全邮件'
  }
])

// 过滤后的邮件列表
const filteredEmails = computed(() => {
  let emails = favoriteEmails.value
  
  // 按分类过滤
  if (activeCategory.value !== 'all') {
    emails = emails.filter(email => email.category === activeCategory.value)
  }
  
  // 按搜索查询过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    emails = emails.filter(email => 
      email.subject.toLowerCase().includes(query) ||
      email.sender.toLowerCase().includes(query)
    )
  }
  
  // 排序
  emails.sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy.value) {
      case 'subject':
        aValue = a.subject
        bValue = b.subject
        break
      case 'sender':
        aValue = a.sender
        bValue = b.sender
        break
      default:
        aValue = a.favoriteDate
        bValue = b.favoriteDate
    }
    
    if (sortOrder.value === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })
  
  return emails
})

// 搜索收藏
const searchFavorites = () => {
  // 搜索逻辑已在 computed 中实现
}

// 获取分类徽章样式
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'important': return 'badge-error'
    case 'work': return 'badge-warning'
    case 'personal': return 'badge-info'
    default: return 'badge-ghost'
  }
}

// 获取结果颜色
const getResultColor = (result: string) => {
  switch (result) {
    case '垃圾邮件': return 'text-error'
    case '安全邮件': return 'text-success'
    case '可疑邮件': return 'text-warning'
    default: return 'text-info'
  }
}

// 查看邮件详情
const viewEmail = (email: any) => {
  alert(`查看邮件详情：${email.subject}`)
}

// 编辑分类
const editCategory = (email: any) => {
  alert(`编辑邮件分类：${email.subject}`)
}

// 从收藏中移除
const removeFromFavorites = (emailId: number) => {
  if (confirm('确定要移除这封邮件的收藏吗？')) {
    const index = favoriteEmails.value.findIndex(email => email.id === emailId)
    if (index > -1) {
      favoriteEmails.value.splice(index, 1)
      // 更新分类计数
      updateCategoryCounts()
    }
  }
}

// 添加分类
const addCategory = () => {
  if (newCategoryName.value.trim()) {
    const newId = Date.now().toString()
    categories.value.push({
      id: newId,
      name: newCategoryName.value.trim(),
      count: 0
    })
    newCategoryName.value = ''
    showAddCategoryModal.value = false
  }
}

// 导出收藏
const exportFavorites = () => {
  alert('导出收藏功能开发中...')
}

// 更新分类计数
const updateCategoryCounts = () => {
  categories.value.forEach(category => {
    if (category.id === 'all') {
      category.count = favoriteEmails.value.length
    } else {
      category.count = favoriteEmails.value.filter(email => email.category === category.id).length
    }
  })
}
</script>

<style scoped>
.active {
  @apply bg-primary text-primary-content;
}
</style>