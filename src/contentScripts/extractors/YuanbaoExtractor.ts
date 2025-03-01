/**
 * 腾讯元宝聊天记录提取器
 * 实现了从腾讯元宝网站提取聊天记录的具体逻辑
 */
import { BaseExtractor, type ChatData, type ChatMessage } from './BaseExtractor'

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
    const title = titleElement?.textContent?.trim() || '未提取到标题'

    // 定义消息元素类型接口
    interface MessageElement {
      type: 'user' | 'thinking' | 'assistant'
      element: Element
      position: number
      content: string
    }

    // 收集所有消息并保存它们的位置信息
    const allMessageElements: MessageElement[] = []

    // 添加用户消息
    userMessages.forEach((element) => {
      const content = element.textContent?.trim() || ''
      if (content) {
        allMessageElements.push({
          type: 'user',
          element,
          position: this.getElementPosition(element),
          content,
        })
      }
    })

    // 添加AI思考
    aiThinkingElements.forEach((element) => {
      const content = element.textContent?.trim() || ''
      if (content) {
        allMessageElements.push({
          type: 'thinking',
          element,
          position: this.getElementPosition(element),
          content,
        })
      }
    })

    // 添加AI回答
    aiResponseElements.forEach((element) => {
      const content = element.innerHTML || ''
      if (content) {
        allMessageElements.push({
          type: 'assistant',
          element,
          position: this.getElementPosition(element),
          content,
        })
      }
    })

    // 按页面位置从上到下排序所有消息
    allMessageElements.sort((a, b) => a.position - b.position)

    // 构建最终的消息数组
    const messages: ChatMessage[] = []

    // 使用更可靠的对话分组方法
    // 创建对话组数组，每组包含一个用户问题和对应的AI思考与回答
    const conversations: { user?: MessageElement, thinking?: MessageElement, assistant?: MessageElement }[] = []
    let currentConversation: { user?: MessageElement, thinking?: MessageElement, assistant?: MessageElement } = {}

    // 遍历所有消息元素，按顺序组织成对话组
    for (const messageElement of allMessageElements) {
      if (messageElement.type === 'user') {
        // 如果当前已有对话组且不为空，则保存当前对话组并创建新的
        if (Object.keys(currentConversation).length > 0) {
          conversations.push(currentConversation)
          currentConversation = {}
        }
        // 添加用户消息到新对话组
        currentConversation.user = messageElement
      }
      else if (messageElement.type === 'thinking' && currentConversation.user && !currentConversation.thinking) {
        // 添加AI思考到当前对话组
        currentConversation.thinking = messageElement
      }
      else if (messageElement.type === 'assistant' && currentConversation.user && !currentConversation.assistant) {
        // 添加AI回答到当前对话组
        currentConversation.assistant = messageElement
      }
      // 如果遇到看似孤立的AI回答或思考，记录警告
      else {
        console.warn('警告：发现无法匹配到对话组的消息元素', messageElement)
      }
    }

    // 添加最后一个对话组
    if (Object.keys(currentConversation).length > 0) {
      conversations.push(currentConversation)
    }

    // 将对话组转换为消息数组
    conversations.forEach((conversation, index) => {
      if (conversation.user) {
        messages.push({
          id: `user-${index}`,
          role: 'user',
          content: conversation.user.content,
        })
      }

      if (conversation.thinking) {
        messages.push({
          id: `ai-thinking-${index}`,
          role: 'thinking',
          content: conversation.thinking.content,
        })
      }

      if (conversation.assistant) {
        messages.push({
          id: `ai-response-${index}`,
          role: 'assistant',
          content: conversation.assistant.content,
        })
      }
    })

    return {
      title,
      url: window.location.href,
      messages,
    }
  }
}
