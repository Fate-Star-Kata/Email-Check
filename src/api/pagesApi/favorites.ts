import serviceAxios from '@/http'
import type {
  BaseResponse,
  PaginatedResponse,
  FavoriteQueryParams,
  FavoriteRecord,
  AddFavoriteRequest
} from '@/types/apis/pageApis_T'

/**
 * 获取收藏列表
 * 支持分页和搜索功能
 */
export function getFavorites(params?: FavoriteQueryParams): Promise<PaginatedResponse<FavoriteRecord>> {
  return serviceAxios({
    url: '/favorites/',
    method: 'get',
    params,
  })
}

/**
 * 添加收藏
 * 将检测记录添加到收藏列表
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
 * 从收藏列表中删除指定记录
 */
export function deleteFavorite(favoriteId: number): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: `/favorites/${favoriteId}/`,
    method: 'delete',
  })
}

/**
 * 批量删除收藏
 * 批量删除多个收藏记录
 */
export function batchDeleteFavorites(favoriteIds: number[]): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/favorites/batch-delete/',
    method: 'post',
    data: { favorite_ids: favoriteIds },
  })
}

/**
 * 导出收藏列表
 * 导出收藏的邮件记录
 */
export function exportFavorites(favoriteIds?: number[]): Promise<BaseResponse<any>> {
  return serviceAxios({
    url: '/favorites/export/',
    method: 'post',
    data: favoriteIds ? { favorite_ids: favoriteIds } : {},
    responseType: 'blob'
  })
}
