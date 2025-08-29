// 邮件检测系统API类型定义

// 基础响应类型
export interface BaseResponse<T = any> {
  msg: string
  code: number
  success: boolean
  data: T
}

// 分页响应类型
export interface PaginatedResponse<T> {
  records: any
  total: number
  code: number
  msg: string | null
  data: {
    total: number
    page: number
    page_size: number
    records?: T[]
    favorites?: T[]
  }
}

// 邮件检测相关类型
export interface EmailDetectionRequest {
  email_content: string
  email_sender?: string
  email_subject?: string
}

export interface FileDetectionRequest {
  file: File
  sender_email?: string
}

export interface DetectionResult {
  confidence: number
  result: string
  detection_result: 'spam' | 'normal'
  confidence_score: number
  risk_factors?: string[]
  record_id: number
  file_info?: {
    filename: string
    size: number
  }
}

// 用户反馈类型
export interface FeedbackRequest {
  record_id: number
  feedback_type: 'correct' | 'incorrect'
  actual_result?: 'spam' | 'legitimate'
  comments?: string
}

export interface FeedbackResponse {
  message: string
}

// 历史记录类型
export interface HistoryQueryParams {
  page?: number
  page_size?: number
  result?: 'spam' | 'legitimate'
  start_date?: string
  end_date?: string
}

export interface HistoryRecord {
  id: number
  email_content: string
  detection_result: string
  confidence_score: number
  created_at: string
  sender_email: string
  subject: string
  isFavorite: boolean
  favorite_id: number
}

export interface HistoryDetailRecord {
  id: number
  user: string
  email_subject: string
  email_sender: string
  email_content: string
  input_type: string
  input_type_display: string
  file_name: string
  detection_result: string
  detection_result_display: string
  confidence_score: number
  risk_factors: string[]
  user_feedback: string
  user_feedback_display: string
  created_at: string
  updated_at: string
  content: string
  sender: string
  subject: string
}

// 收藏相关类型
export interface FavoriteQueryParams {
  page?: number
  page_size?: number
}

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
  subject: string
  sender: string
  content: string
}

export interface AddFavoriteRequest {
  record_id: number
  note?: string
}

// 用户仪表板类型
export interface UserDashboardData {
  total_checks: number
  spam_blocked: number
  favorite_emails: number
  accuracy_rate: number
  recent_detections: {
    id: number
    email_subject: string
    email_sender: string
    detection_result: string
    confidence_score: number
    created_at: string
  }[]
}

// 用户统计类型
export interface UserStatisticsParams {
  period?: 'month' | 'quarter' | 'year'
  start_date?: string
  end_date?: string
}

export interface BasicStats {
  id: number
  user: string
  total_detections: number
  spam_detected: number
  normal_detected: number
  favorite_count: number
  accuracy_rate: number
  last_detection_time: string
  created_at: string
  updated_at: string
}

export interface DailyStats {
  date: string
  total_detections: number
  spam_count: number
  normal_count: number
  suspicious_count: number
  accuracy_rate: number
  favorite_count: number
}

export interface MonthlyStats {
  month: string
  total: number
  spam: number
  normal: number
}

export interface UserStatisticsData {
  basic_stats: BasicStats
  daily_stats: DailyStats[]
  monthly_stats: MonthlyStats[]
  risk_factors_stats: Record<string, number>
  favorite_count: number
}

// 管理员仪表板类型
export interface AdminDashboardData {
  system_stats: {
    total_users: number
    active_users: number
    total_detections: number
    spam_detections: number
    spam_rate: number
  }
  recent_active_users: {
    id: number
    username: string
    email: string
    last_login: string
  }[]
  risk_users: {
    id: number
    user_id: number
    username: string
    risk_level: string
    risk_type: string
    created_at: string
  }[]
  system_status: {
    database_status: string
    ml_model_status: string
    api_status: string
  }
}

// 管理员记录查询类型
export interface AdminRecordsParams {
  page?: number
  page_size?: number
  result?: 'spam' | 'legitimate'
  user_id?: number
}

export interface AdminRecord {
  id: number
  user: {
    id: number
    username: string
  }
  email_content: string
  detection_result: string
  confidence_score: number
  created_at: string
  sender_email: string
  subject: string
}
