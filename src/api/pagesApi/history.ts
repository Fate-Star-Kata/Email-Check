import serviceAxios from '@/http'
import type {
  BaseResponse,
  PaginatedResponse,
  HistoryQueryParams,
  HistoryRecord,
  HistoryDetailRecord,
  FeedbackRequest,
  FeedbackResponse,
  AddFavoriteRequest
} from '@/types/apis/pageApis_T'

/**
 * 获取检测历史
 * 获取用户的检测历史记录，支持分页、筛选和搜索
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
 * 获取单个检测记录的详细信息
 */
export function getHistoryDetail(recordId: number): Promise<BaseResponse<HistoryDetailRecord>> {
  return serviceAxios({
    url: `/mail/history/${recordId}/`,
    method: 'get',
  })
}

/**
 * 提交用户反馈
 * 用户对检测结果提供反馈
 */
export function submitFeedback(data: FeedbackRequest): Promise<BaseResponse<FeedbackResponse>> {
  return serviceAxios({
    url: '/feedback/',
    method: 'post',
    data,
  })
}

/**
 * 清空历史记录
 * 删除用户的所有历史记录
 */
export function clearHistory(): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/history/clear/',
    method: 'delete',
  })
}

/**
 * 导出历史记录
 * 导出用户的检测历史记录
 */
export function exportHistory(params?: HistoryQueryParams): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/history/export/',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 删除单个历史记录
 * 删除指定的历史记录
 */
export function deleteHistoryRecord(recordId: number): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: `/mail/history/${recordId}/`,
    method: 'delete',
  })
}

/**
 * 批量删除历史记录
 * 批量删除多个历史记录
 */
export function batchDeleteHistory(recordIds: number[]): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/history/batch-delete/',
    method: 'post',
    data: { record_ids: recordIds },
  })
}

/**
 * 添加收藏
 * 将检测记录添加到用户收藏列表
 */
export function addFavorite(data: AddFavoriteRequest): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/favorites/',
    method: 'post',
    data,
  })
}

/**
 * 删除收藏
 * 从收藏列表中删除指定记录
 */
export function deleteFavorite(favoriteId: number): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: `/mail/favorites/${favoriteId}/`,
    method: 'delete',
  })
}
