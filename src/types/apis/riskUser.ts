// 风险用户相关类型定义

// 风险等级枚举
export enum RiskLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  MONITORING = 'monitoring',
  RESTRICTED = 'restricted',
  SUSPENDED = 'suspended'
}

// 分析类型枚举
export enum AnalysisType {
  BEHAVIOR = 'behavior',
  PATTERN = 'pattern',
  FREQUENCY = 'frequency',
  CONTENT = 'content'
}

// 风险用户接口
export interface RiskUser {
  id: string
  userId: string
  email: string
  name: string
  avatar?: string
  riskLevel: RiskLevel
  riskScore: number
  riskFactors: string[]
  detectionCount: number
  spamRate: number
  lastActivity: string
  status: UserStatus
  createdAt: string
  updatedAt: string
}

// 风险等级统计接口
export interface RiskLevelStats {
  highRisk: number
  mediumRisk: number
  lowRisk: number
  totalRisk: number
  riskPercentage: number
}

// 风险分析参数接口
export interface RiskAnalysisParams {
  analysisType: AnalysisType
  timeRange: '7days' | '30days' | '90days' | '1year'
  riskThreshold: number
}

// 风险用户筛选参数接口
export interface RiskUserFilter {
  searchQuery?: string
  riskLevel?: RiskLevel
  status?: UserStatus
  sortBy?: 'riskScore' | 'lastActivity' | 'detectionCount'
  sortOrder?: 'asc' | 'desc'
  page: number
  pageSize: number
}

// 风险用户列表响应接口
export interface RiskUsersResponse {
  success: boolean
  message: string
  code: number
  data: {
    users: RiskUser[]
    total: number
    page: number
    pageSize: number
    stats: RiskLevelStats
  }
}

// 风险用户详情接口
export interface RiskUserDetail extends RiskUser {
  behaviorAnalysis: {
    loginFrequency: number
    detectionPattern: string[]
    suspiciousActivities: string[]
  }
  riskHistory: {
    date: string
    riskScore: number
    riskLevel: RiskLevel
    changes: string[]
  }[]
  processingRecommendations: string[]
}

// 风险用户详情响应接口
export interface RiskUserDetailResponse {
  success: boolean
  message: string
  code: number
  data: RiskUserDetail
}

// 批量风险管理请求接口
export interface BatchRiskManagementRequest {
  userIds: string[]
  action: 'monitor' | 'restrict' | 'notify' | 'analyze'
  reason?: string
}

// 批量风险管理响应接口
export interface BatchRiskManagementResponse {
  success: boolean
  message: string
  code: number
  data: {
    successCount: number
    failedCount: number
    failedIds?: string[]
  }
}

// 风险分析响应接口
export interface RiskAnalysisResponse {
  success: boolean
  message: string
  code: number
  data: {
    analysisType: AnalysisType
    timeRange: string
    results: {
      userId: string
      riskScore: number
      riskFactors: string[]
      recommendations: string[]
    }[]
  }
}