<script setup lang="ts">
import { ref } from 'vue'
import 'uno.css'

// 状态管理
const isExtracting = ref(false)
const extractionStatus = ref('')
const showToast = ref(false)

// 提取聊天记录的主函数
async function extractChatHistory() {
  try {
    isExtracting.value = true
    extractionStatus.value = '正在提取聊天记录...'
    showToast.value = true

    // 1. 获取聊天记录
    const chatData = await getChatData()

    if (!chatData || chatData.messages.length === 0) {
      extractionStatus.value = '未找到聊天记录'
      setTimeout(() => {
        showToast.value = false
        isExtracting.value = false
      }, 3000)
      return
    }

    // 2. 准备下载数据
    const jsonData = JSON.stringify(chatData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    // 3. 生成文件名
    const title = chatData.title || 'chat'
    const fileName = `deepseek_${title}.json`

    // 4. 使用消息传递方式下载文件
    // 这里改用 webext-bridge 发送消息到后台脚本
    try {
      // 方法1：尝试使用 sendMessage 发送消息到后台
      await browser.runtime.sendMessage({
        type: 'download-chat-history',
        data: {
          url,
          fileName,
        },
      })

      extractionStatus.value = '聊天记录已保存!'
    }
    catch (downloadError) {
      console.error('下载失败 (方法1):', downloadError)

      // 方法2：如果方法1失败，尝试直接使用 a 标签下载
      try {
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        extractionStatus.value = '聊天记录已保存!'
      }
      catch (fallbackError) {
        console.error('下载失败 (方法2):', fallbackError)
        extractionStatus.value = '下载失败，请检查浏览器权限'
      }
    }

    // 5. 清理临时URL
    setTimeout(() => {
      URL.revokeObjectURL(url)
      showToast.value = false
    }, 3000)
  }
  catch (error) {
    console.error('提取失败:', error)
    extractionStatus.value = `提取失败: ${error.message}`
  }
  finally {
    isExtracting.value = false
  }
}

// 从页面提取聊天数据的函数
async function getChatData() {
  // DeepSeek聊天容器识别
  const _chatContainer = document.querySelector('.main-layout__content') || document.body

  // 查找所有对话元素 - 按照DOM顺序（从上到下）
  const userMessages = Array.from(document.querySelectorAll('div[class^="fbb"]'))
  const aiThinkingElements = Array.from(document.querySelectorAll('div[class^="e16"]'))
  const aiResponseElements = Array.from(document.querySelectorAll('div.ds-markdown.ds-markdown--block'))

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
  const titleElement = document.querySelector('div[class^="d8ed659a"]')
  const title = titleElement ? titleElement.textContent.trim() : '未提取到标题'

  // 收集所有消息并保存它们的位置信息
  const allMessageElements = []

  // 添加用户消息
  userMessages.forEach((element) => {
    allMessageElements.push({
      type: 'user',
      element,
      position: getElementPosition(element),
    })
  })

  // 添加AI思考
  aiThinkingElements.forEach((element) => {
    allMessageElements.push({
      type: 'thinking',
      element,
      position: getElementPosition(element),
    })
  })

  // 添加AI回答
  aiResponseElements.forEach((element) => {
    allMessageElements.push({
      type: 'assistant',
      element,
      position: getElementPosition(element),
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
      const paragraphs = Array.from(messageElement.element.querySelectorAll('p[class^="ba9"]'))
      if (paragraphs.length > 0) {
        const content = paragraphs.map(p => p.textContent.trim()).join('\n\n')
        if (content) {
          messages.push({
            id: `ai-thinking-${messageIndex}`,
            role: 'thinking',
            content,
          })
        }
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
          rawText: messageElement.element.textContent.trim(),
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

// 获取元素在页面中的垂直位置（用于排序）
function getElementPosition(element) {
  const rect = element.getBoundingClientRect()
  // 用Y坐标作为排序依据，确保从上到下的顺序
  return rect.top + window.scrollY
}
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex flex-col items-end font-sans select-none leading-1em">
    <!-- 提示框 -->
    <div
      v-if="showToast"
      class="bg-white text-gray-800 rounded-lg shadow w-max h-min"
      p="x-4 y-2"
      m="y-auto b-2"
      transition="all duration-300"
    >
      <p>{{ extractionStatus }}</p>
    </div>

    <!-- 提取按钮 -->
    <button
      class="flex w-12 h-12 rounded-full shadow cursor-pointer border-none"
      :class="isExtracting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'"
      :disabled="isExtracting"
      @click="extractChatHistory"
    >
      <div class="block m-auto text-white text-lg">
        <div v-if="isExtracting" class="animate-spin">
          ⏳
        </div>
        <div v-else>
          💾
        </div>
      </div>
    </button>
  </div>
</template>
