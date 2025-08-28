// 邮件检测系统API类型定义

// 基础响应类型
export interface BaseResponse<T = any> {
  success: boolean
  data: T
}

// 分页响应类型
export interface PaginatedResponse<T> {
  records?: T[]
  favorites?: T[]
  total: number
  page: number
  page_size: number
}

// 邮件检测相关类型
export interface EmailDetectionRequest {
  email_content: string
  sender_email?: string
  subject?: string
}

export interface FileDetectionRequest {
  file: File
  sender_email?: string
}

export interface DetectionResult {
  detection_result: 'spam' | 'legitimate'
  confidence_score: number
  risk_factors: string[]
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
}

export interface HistoryDetailRecord extends HistoryRecord {
  risk_factors: string[]
  file_path: string
  user_feedback: {
    feedback_type: string
    comments: string
  }
}

// 收藏相关类型
export interface FavoriteQueryParams {
  page?: number
  page_size?: number
}

export interface FavoriteRecord {
  id: number
  record: {
    id: number
    subject: string
    sender_email: string
    detection_result: string
  }
  created_at: string
  notes: string
}

export interface AddFavoriteRequest {
  record_id: number
  notes?: string
}

// 用户仪表板类型
export interface UserDashboardData {
  user_info: {
    username: string
    email: string
    join_date: string
  }
  statistics: {
    total_detections: number
    spam_detected: number
    legitimate_detected: number
    accuracy_rate: number
  }
  recent_detections: {
    id: number
    subject: string
    detection_result: string
    created_at: string
  }[]
  favorite_emails: {
    id: number
    subject: string
    notes: string
  }[]
}

// 用户统计类型
export interface UserStatisticsParams {
  period?: 'month' | 'quarter' | 'year'
  start_date?: string
  end_date?: string
}

export interface UserStatisticsData {
  monthly_stats: {
    month: string
    total_detections: number
    spam_count: number
    legitimate_count: number
  }[]
  risk_factors_stats: Record<string, number>
  accuracy_trend: {
    date: string
    accuracy: number
  }[]
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
