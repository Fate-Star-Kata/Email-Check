import serviceAxios from '@/http'
import type {
  BaseResponse,
  EmailDetectionRequest,
  FileDetectionRequest,
  DetectionResult
} from '@/types/apis/pageApis_T'

/**
 * 文本邮件检测
 * 用于检测邮件文本内容是否为垃圾邮件
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
 * 上传邮件文件进行检测
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
 * 批量邮件检测
 * 批量处理多个邮件文件
 */
export function batchEmailDetection(files: FormData): Promise<BaseResponse<DetectionResult[]>> {
  return serviceAxios({
    url: '/mail/detect/batch/',
    method: 'post',
    data: files,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
