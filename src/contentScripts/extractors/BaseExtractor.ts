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
    catch (error: any) {
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
   * 通用HTML内容清理方法
   * 清理HTML内容，保留关键格式同时移除不必要的标签和样式
   * @param element 要处理的HTML元素或HTML字符串
   * @returns 清理后的文本内容
   */
  protected cleanHTML(element: Element | string): string {
    // 创建临时容器用于处理
    const tempContainer = document.createElement('div')

    // 根据输入类型设置内容
    if (typeof element === 'string') {
      tempContainer.innerHTML = element
    }
    else {
      tempContainer.innerHTML = element.innerHTML || ''
    }

    // 处理代码块，保留代码格式但移除过多的样式信息
    const codeBlocks = tempContainer.querySelectorAll('pre, code')
    codeBlocks.forEach((codeBlock) => {
      // 获取原始代码文本
      const codeText = codeBlock.textContent || ''
      // 如果是pre元素，创建新的pre元素保留代码块格式
      if (codeBlock.tagName.toLowerCase() === 'pre') {
        const newPre = document.createElement('pre')
        newPre.textContent = codeText
        codeBlock.parentNode?.replaceChild(newPre, codeBlock)
      }
      // 如果是内联code元素，创建新的code元素
      else {
        const newCode = document.createElement('code')
        newCode.textContent = codeText
        codeBlock.parentNode?.replaceChild(newCode, codeBlock)
      }
    })

    // 保留基本格式元素，但移除复杂样式
    const formatElements = tempContainer.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li, br, strong, em, b, i, a, blockquote, table, tr, td, th')
    formatElements.forEach((el) => {
      // 保留a标签的href属性
      if (el.tagName.toLowerCase() === 'a') {
        const href = el.getAttribute('href')
        // 移除所有属性
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
        // 恢复href属性
        if (href) {
          el.setAttribute('href', href)
        }
      }
      // 对于其他元素，移除所有属性
      else {
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
      }
    })

    // 移除所有span, div等通常用于样式的元素，但保留其内容
    const styleElements = tempContainer.querySelectorAll('span, div')
    styleElements.forEach((el) => {
      // 防止替换已经处理过的代码和格式元素
      if (el.parentNode
        && !el.querySelector('pre')
        && !el.querySelector('code')
        && !el.querySelector('ul, ol, li')
        && el.tagName.toLowerCase() !== 'pre'
        && el.tagName.toLowerCase() !== 'code') {
        // 替换元素内容，保留文本和格式化元素
        const fragment = document.createDocumentFragment()
        while (el.firstChild) {
          fragment.appendChild(el.firstChild)
        }
        el.parentNode.replaceChild(fragment, el)
      }
    })

    // 移除所有样式和类属性
    const allElements = tempContainer.querySelectorAll('*')
    allElements.forEach((el) => {
      el.removeAttribute('style')
      el.removeAttribute('class')
    })

    // 移除脚本标签
    const scriptElements = tempContainer.querySelectorAll('script')
    scriptElements.forEach(el => el.remove())

    // 移除空白元素
    this.removeEmptyElements(tempContainer)

    // 返回清理后的HTML内容
    return tempContainer.innerHTML
  }

  /**
   * 递归移除空白元素
   * @param element 要处理的元素
   */
  private removeEmptyElements(element: Element): void {
    // 获取所有子元素
    const children = Array.from(element.children)

    // 递归处理每个子元素
    for (const child of children) {
      this.removeEmptyElements(child)
    }

    // 如果当前元素没有子元素且内容为空，则移除它
    if (element.children.length === 0
      && !element.textContent?.trim()
      && element.tagName.toLowerCase() !== 'br'
      && element.tagName.toLowerCase() !== 'img') {
      element.remove()
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
}

/**
 * 聊天数据的类型定义
 */
export interface ChatData {
  title: string
  url: string
  messages: ChatMessage[]
  metadata?: {
    extractTime: string
    version: string
    [key: string]: any
  }
}
