import serviceAxios from '@/http'
import type {
  BaseResponse,
  UserDashboardData,
  EmailDetectionRequest,
  DetectionResult
} from '@/types/apis/pageApis_T'

/**
 * 获取用户仪表板数据
 * 包含用户信息、统计数据、最近检测记录、收藏邮件等
 */
export function getUserDashboard(): Promise<BaseResponse<UserDashboardData>> {
  return serviceAxios({
    url: '/mail/dashboard/',
    method: 'get',
  })
}

/**
 * 快速邮件检测（仪表板快速检测功能）
 * 用于仪表板页面的快速检测功能
 */
export function quickEmailDetection(data: EmailDetectionRequest): Promise<BaseResponse<DetectionResult>> {
  return serviceAxios({
    url: '/mail/detect/',
    method: 'post',
    data,
  })
}
