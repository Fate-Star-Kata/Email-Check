import serviceAxios from '@/http'
import type {
  BaseResponse,
  PaginatedResponse,
  EmailDetectionRequest,
  FileDetectionRequest,
  DetectionResult,
  FeedbackRequest,
  FeedbackResponse,
  HistoryQueryParams,
  HistoryRecord,
  HistoryDetailRecord,
  FavoriteQueryParams,
  FavoriteRecord,
  AddFavoriteRequest,
  UserDashboardData,
  UserStatisticsParams,
  UserStatisticsData,
  AdminDashboardData,
  AdminRecordsParams,
  AdminRecord
} from '@/types/apis/pageApis_T'

// 邮件检测相关API

/**
 * 文本邮件检测
 */
export function detectEmailText(data: EmailDetectionRequest): Promise<BaseResponse<DetectionResult>> {
  return serviceAxios({
    url: '/mail/detect/',
    method: 'post',
    data,
  })
}

/**
 * 文件上传检测
 */
export function detectEmailFile(data: FormData): Promise<BaseResponse<DetectionResult>> {
  return serviceAxios({
    url: '/mail/detect/file/',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 提交用户反馈
 */
export function submitFeedback(data: FeedbackRequest): Promise<BaseResponse<FeedbackResponse>> {
  return serviceAxios({
    url: '/feedback/',
    method: 'post',
    data,
  })
}

// 历史记录相关API

/**
 * 获取检测历史
 */
export function getDetectionHistory(params: HistoryQueryParams): Promise<BaseResponse<PaginatedResponse<HistoryRecord>>> {
  return serviceAxios({
    url: '/mail/history/',
    method: 'get',
    params,
  })
}

/**
 * 获取检测记录详情
 */
export function getHistoryDetail(recordId: number): Promise<BaseResponse<HistoryDetailRecord>> {
  return serviceAxios({
    url: `/history/${recordId}/`,
    method: 'get',
  })
}

// 收藏相关API

/**
 * 获取收藏列表
 */
export function getFavorites(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<FavoriteRecord>> {
  return serviceAxios({
    url: '/favorites/',
    method: 'get',
    params,
  })
}

/**
 * 添加收藏
 */
export function addFavorite(data: AddFavoriteRequest): Promise<BaseResponse<FavoriteRecord>> {
  return serviceAxios({
    url: '/favorites/',
    method: 'post',
    data,
  })
}

/**
 * 删除收藏
 */
export function deleteFavorite(favoriteId: number): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: `/favorites/${favoriteId}/`,
    method: 'delete',
  })
}

// 用户相关API

/**
 * 获取用户仪表板数据
 */
export function getUserDashboard(): Promise<BaseResponse<UserDashboardData>> {
  return serviceAxios({
    url: '/user/dashboard/',
    method: 'get',
  })
}

/**
 * 获取用户统计信息
 */
export function getUserStatistics(params: UserStatisticsParams): Promise<BaseResponse<UserStatisticsData>> {
  return serviceAxios({
    url: '/user/statistics/',
    method: 'get',
    params,
  })
}

// 管理员相关API

/**
 * 获取管理员仪表板
 */
export function getAdminDashboard(): Promise<BaseResponse<AdminDashboardData>> {
  return serviceAxios({
    url: '/admin/dashboard/',
    method: 'get',
  })
}

/**
 * 管理员获取所有记录
 * 管理员查看所有用户的检测记录
 */
export function getAdminRecords(params: AdminRecordsParams): Promise<BaseResponse<PaginatedResponse<AdminRecord>>> {
  return serviceAxios({
    url: '/admin/records/',
    method: 'get',
    params,
  })
}

/*
 * ========================================
 * 未使用的API接口说明
 * ========================================
 * 
 * 以下API接口已被拆分到各个页面专用的API文件中：
 * 
 * 1. dashboard页面使用的API：
 *    - getUserDashboard (用户仪表板数据)
 *    - quickEmailDetection (快速邮件检测)
 *    已移至：src/api/pagesApi/dashboard.ts
 * 
 * 2. email-check页面使用的API：
 *    - detectEmailText (文本邮件检测)
 *    - detectEmailFile (文件上传检测)
 *    - batchEmailDetection (批量邮件检测)
 *    已移至：src/api/pagesApi/email-check.ts
 * 
 * 3. favorites页面使用的API：
 *    - getFavorites (获取收藏列表)
 *    - addFavorite (添加收藏)
 *    - deleteFavorite (删除收藏)
 *    已移至：src/api/pagesApi/favorites.ts
 * 
 * 4. history页面使用的API：
 *    - getDetectionHistory (获取检测历史)
 *    - getHistoryDetail (获取检测记录详情)
 *    - submitFeedback (提交用户反馈)
 *    已移至：src/api/pagesApi/history.ts
 * 
 * 5. statistics页面使用的API：
 *    - getUserStatistics (获取用户统计信息)
 *    已移至：src/api/pagesApi/statistics.ts
 * 
 * 未使用的API接口（管理员功能，当前用户页面不需要）：
 *    - getAdminDashboard (管理员仪表板数据)
 *    - getAdminRecords (管理员获取所有记录)
 * 
 * 注意：如果后续需要添加管理员页面，可以创建单独的admin相关API文件。
 */
