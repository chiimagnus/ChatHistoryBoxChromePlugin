/**
 * 聊天记录提取器基类
 * 实现了通用的提取和下载逻辑，具体的DOM选择器由子类实现
 */
export abstract class BaseExtractor {
  protected isExtracting = false
  protected extractionStatus = ''

  /**
   * 初始化提取器
   * @param platform 平台名称，用于生成文件名
   */
  constructor(protected platform: string) {}

  /**
   * 提取聊天记录的主函数
   * @returns Promise<void>
   */
  public async extractChatHistory(): Promise<void> {
    try {
      this.isExtracting = true
      this.extractionStatus = '正在提取聊天记录...'

      // 1. 获取聊天记录
      const chatData = await this.getChatData()

      if (!chatData || chatData.messages.length === 0) {
        this.extractionStatus = '未找到聊天记录'
        return
      }

      // 2. 准备下载数据
      const jsonData = JSON.stringify(chatData, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // 3. 生成文件名
      const title = chatData.title || 'chat'
      const fileName = `${this.platform}_${title}.json`

      // 4. 下载文件
      try {
        await browser.runtime.sendMessage({
          type: 'download-chat-history',
          data: { url, fileName },
        })
        this.extractionStatus = '聊天记录已保存!'
      }
      catch (downloadError) {
        console.error('下载失败 (方法1):', downloadError)
        await this.fallbackDownload(url, fileName)
      }

      // 5. 清理临时URL
      URL.revokeObjectURL(url)
    }
    catch (error) {
      console.error('提取失败:', error)
      this.extractionStatus = `提取失败: ${error.message}`
    }
    finally {
      this.isExtracting = false
    }
  }

  /**
   * 获取元素在页面中的垂直位置（用于排序）
   * @param element DOM元素
   * @returns number 元素的垂直位置
   */
  protected getElementPosition(element: Element): number {
    const rect = element.getBoundingClientRect()
    return rect.top + window.scrollY
  }

  /**
   * 备用下载方法
   * @param url 文件URL
   * @param fileName 文件名
   */
  protected async fallbackDownload(url: string, fileName: string): Promise<void> {
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      this.extractionStatus = '聊天记录已保存!'
    }
    catch (fallbackError) {
      console.error('下载失败 (方法2):', fallbackError)
      this.extractionStatus = '下载失败，请检查浏览器权限'
    }
  }

  /**
   * 获取聊天数据的抽象方法，由子类实现
   * @returns Promise<ChatData | null>
   */
  protected abstract getChatData(): Promise<ChatData | null>
}

/**
 * 聊天消息的类型定义
 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'thinking'
  content: string
  rawText?: string
}

/**
 * 聊天数据的类型定义
 */
export interface ChatData {
  title: string
  url: string
  messages: ChatMessage[]
}
