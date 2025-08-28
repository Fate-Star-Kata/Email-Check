// 检测记录相关类型定义

// 检测结果枚举
export enum DetectionResult {
  SPAM = 'spam',
  SAFE = 'safe',
  SUSPICIOUS = 'suspicious'
}

// 置信度等级枚举
export enum ConfidenceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// 检测记录接口
export interface DetectionRecord {
  senderEmail: any
  result: any
  senderEmail: any
  riskScore: any
  ipAddress: string
  userAgent: string
  senderName: string
  sentAt: string
  mailServer: string
  recipientEmail: string
  receivedAt: string
  emailSize: string
  attachmentCount: number
  subject: string
  contentPreview: string
  matchedRules: never[]
  aiModel: string
  modelVersion: string
  analysisDepth: string
  suggestions: never[]
  detectedAt: any
  id: string
  userId: string
  userEmail: string
  userName: string
  emailSubject: string
  emailSender: string
  emailContent?: string
  detectionResult: DetectionResult
  confidence: number
  confidenceLevel: ConfidenceLevel
  detectionTime: string
  processingTime: number
  riskFactors: string[]
  aiAnalysis?: string
}

// 检测记录统计接口
export interface DetectionStats {
  todayDetections: number
  spamDetections: number
  safeDetections: number
  averageAccuracy: number
}

// 检测记录筛选参数接口
export interface DetectionFilter {
  userQuery?: string
  detectionResult?: DetectionResult
  confidenceLevel?: ConfidenceLevel
  timeRange?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// 检测记录列表响应接口
export interface DetectionRecordsResponse {
  success: boolean
  message: string
  code: number
  data: {
    records: DetectionRecord[]
    total: number
    page: number
    pageSize: number
    stats: DetectionStats
  }
}

// 检测记录详情响应接口
export interface DetectionRecordDetailResponse {
  success: boolean
  message: string
  code: number
  data: DetectionRecord
}

// 批量操作请求接口
export interface BatchDetectionRequest {
  recordIds: string[]
  action: 'analyze' | 'reprocess' | 'export' | 'delete'
}

// 批量操作响应接口
export interface BatchDetectionResponse {
  success: boolean
  message: string
  code: number
  data: {
    successCount: number
    failedCount: number
    failedIds?: string[]
  }
}