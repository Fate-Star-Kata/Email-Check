// 收藏相关的类型定义

// 检测记录信息
export interface DetectionRecord {
  id: number
  email_subject: string
  email_sender: string
  detection_result: string
  detection_result_display: string
  confidence_score: number
  created_at: string
}

// 收藏记录
export interface FavoriteRecord {
  id: number
  user: string
  detection_record: DetectionRecord
  note: string
  created_at: string
}

// 收藏查询参数
export interface FavoriteQueryParams {
  page?: number
  page_size?: number
  search?: string
}

// 分页响应
export interface PaginatedResponse<T> {
  code: number
  msg: string | null
  data: {
    total: number
    page: number
    page_size: number
    favorites: T[]
  }
}

// 添加收藏请求参数
export interface AddFavoriteRequest {
  detection_record_id: number
  note?: string
}

// 删除收藏请求参数
export interface RemoveFavoriteRequest {
  favorite_id: number
}