/**
 * 腾讯元宝聊天记录提取器
 * 实现了从腾讯元宝网站提取聊天记录的具体逻辑
 */
import { BaseExtractor, type ChatData } from './BaseExtractor'

export class YuanbaoExtractor extends BaseExtractor {
  /**
   * 构造函数
   */
  constructor() {
    super('yuanbao') // 调用父类构造函数，传入平台名称
  }

  /**
   * 实现父类的抽象方法，从腾讯元宝网页提取聊天数据
   * @returns Promise<ChatData | null>
   */
  protected async getChatData(): Promise<ChatData | null> {
    // 腾讯元宝聊天容器识别
    const _chatContainer = document.querySelector('.chat-container') || document.body

    // 查找所有对话元素 - 按照DOM顺序（从上到下）
    const userMessages = Array.from(document.querySelectorAll('div.hyc-content-text'))
    const aiThinkingElements = Array.from(document.querySelectorAll('div.hyc-component-reasoner__think-content'))
    const aiResponseElements = Array.from(document.querySelectorAll('div.hyc-component-reasoner__text'))

    // 记录找到的消息数量
    // eslint-disable-next-line no-console
    console.log('找到的消息数量:', {
      用户消息: userMessages.length,
      AI思考: aiThinkingElements.length,
      AI回答: aiResponseElements.length,
    })

    if (userMessages.length === 0 && aiResponseElements.length === 0) {
      return null // 未找到任何消息
    }

    // 提取聊天标题
    const titleElement = document.querySelector('span.t-button__text')
    const title = titleElement ? titleElement.textContent.trim() : '未提取到标题'

    // 收集所有消息并保存它们的位置信息
    const allMessageElements = []

    // 添加用户消息
    userMessages.forEach((element) => {
      allMessageElements.push({
        type: 'user',
        element,
        position: this.getElementPosition(element),
      })
    })

    // 添加AI思考
    aiThinkingElements.forEach((element) => {
      allMessageElements.push({
        type: 'thinking',
        element,
        position: this.getElementPosition(element),
      })
    })

    // 添加AI回答
    aiResponseElements.forEach((element) => {
      allMessageElements.push({
        type: 'assistant',
        element,
        position: this.getElementPosition(element),
      })
    })

    // 按页面位置从上到下排序所有消息
    allMessageElements.sort((a, b) => a.position - b.position)

    // 构建最终的消息数组
    const messages = []

    // 处理页面中的所有消息，按顺序组织成规范格式
    let messageIndex = 0
    let currentType = null

    allMessageElements.forEach((messageElement) => {
      // 如果遇到用户消息，开始新的对话组
      if (messageElement.type === 'user') {
        currentType = 'user'
        const content = messageElement.element.textContent.trim()
        if (content) {
          messages.push({
            id: `user-${messageIndex}`,
            role: 'user',
            content,
          })
        }
      }
      // 如果遇到AI思考，并且上一条是用户消息，则关联到当前对话组
      else if (messageElement.type === 'thinking' && currentType === 'user') {
        currentType = 'thinking'
        const content = messageElement.element.textContent.trim()
        if (content) {
          messages.push({
            id: `ai-thinking-${messageIndex}`,
            role: 'thinking',
            content,
          })
        }
      }
      // 如果遇到AI回答，并且上一条是用户消息或AI思考，则关联到当前对话组
      else if (messageElement.type === 'assistant' && (currentType === 'user' || currentType === 'thinking')) {
        currentType = 'assistant'
        const content = messageElement.element.innerHTML
        if (content) {
          messages.push({
            id: `ai-response-${messageIndex}`,
            role: 'assistant',
            content,
          })
        }

        // 一个完整对话组结束，增加索引准备下一组
        messageIndex++
        currentType = null
      }
      // 如果遇到看似孤立的AI回答，记录警告
      else if (messageElement.type === 'assistant' && currentType === null) {
        console.warn('警告：发现没有对应用户问题的AI回答，可能是DOM结构变化导致用户问题未被正确识别', messageElement)
      }
    })

    return {
      title,
      url: window.location.href,
      messages,
    }
  }
}
