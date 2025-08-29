import serviceAxios from '@/http'
import type {
  BaseResponse,
  UserStatisticsParams,
  UserStatisticsData
} from '@/types/apis/pageApis_T'

/**
 * 获取用户统计信息
 * 获取用户的检测统计数据，支持时间范围筛选
 */
export function getUserStatistics(): Promise<BaseResponse<UserStatisticsData>> {
  return serviceAxios({
    url: '/mail/statistics/',
    method: 'get',
  })
}

/**
 * 导出统计报告
 * 导出用户的统计报告
 */
export function exportStatisticsReport(params: UserStatisticsParams): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/statistics/export/',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取检测趋势数据
 * 获取指定时间范围内的检测趋势数据
 */
export function getDetectionTrend(params: UserStatisticsParams): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/statistics/trend/',
    method: 'get',
    params,
  })
}

/**
 * 获取风险因素统计
 * 获取检测到的风险因素统计信息
 */
export function getRiskFactorsStats(params: UserStatisticsParams): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/statistics/risk-factors/',
    method: 'get',
    params,
  })
}

/**
 * 获取准确率趋势
 * 获取检测准确率的趋势数据
 */
export function getAccuracyTrend(params: UserStatisticsParams): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/mail/statistics/accuracy/',
    method: 'get',
    params,
  })
}
