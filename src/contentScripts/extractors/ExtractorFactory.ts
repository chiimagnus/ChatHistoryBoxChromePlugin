/**
 * 提取器工厂类
 * 负责根据当前网站URL创建合适的提取器实例
 */
import type { BaseExtractor } from './BaseExtractor'
import { DeepseekExtractor } from './DeepseekExtractor'
import { YuanbaoExtractor } from './YuanbaoExtractor'

export class ExtractorFactory {
  /**
   * 根据当前URL创建合适的提取器
   * @returns BaseExtractor 返回对应网站的提取器实例
   */
  public static createExtractor(): BaseExtractor {
    const currentUrl = window.location.href

    // 判断当前网站类型
    if (this.isDeepseekUrl(currentUrl)) {
      return new DeepseekExtractor()
    }
    else if (this.isYuanbaoUrl(currentUrl)) {
      return new YuanbaoExtractor()
    }

    // 默认返回Deepseek提取器
    return new DeepseekExtractor()
  }

  /**
   * 判断是否为Deepseek网站
   * @param url 当前URL
   * @returns boolean 是否为Deepseek网站
   */
  private static isDeepseekUrl(url: string): boolean {
    return url.includes('deepseek.com') || url.includes('deepseek.ai')
  }

  /**
   * 判断是否为腾讯元宝网站
   * @param url 当前URL
   * @returns boolean 是否为腾讯元宝网站
   */
  private static isYuanbaoUrl(url: string): boolean {
    // 注意：这里需要根据实际的腾讯元宝网址进行调整
    return url.includes('yuanbao.qq.com') || url.includes('yuanbao.tencent.com')
  }
}
