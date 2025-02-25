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

    // 3. 生成文件名 (日期时间+对话标题)
    const date = new Date()
    const dateString = date.toISOString().split('T')[0]
    const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '-')
    const title = chatData.title || 'chat'
    const fileName = `deepseek_${dateString}_${timeString}_${title}.json`

    // 4. 使用浏览器API下载文件
    await browser.downloads.download({
      url,
      filename: fileName,
      saveAs: true,
    })

    extractionStatus.value = '聊天记录已保存!'

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
  // 尝试查找聊天记录容器元素
  const messageElements = document.querySelectorAll('[data-message-id]')

  if (messageElements.length === 0) {
    return null
  }

  // 提取聊天标题
  const titleElement = document.querySelector('title')
  const title = titleElement ? titleElement.textContent.replace(' - DeepSeek Chat', '').trim() : 'Untitled Chat'

  // 提取消息
  const messages = []

  messageElements.forEach((element) => {
    // 判断消息类型 (用户/AI)
    const isUser = element.querySelector('[data-testid="user-message"]') !== null
    const isAssistant = element.querySelector('[data-testid="assistant-message"]') !== null

    // 提取消息内容
    let content = ''
    const contentElement = element.querySelector('.markdown-body') // Markdown内容

    if (contentElement) {
      content = contentElement.innerHTML
    }
    else {
      const textElement = element.querySelector('div[class*="whitespace-pre-wrap"]')
      if (textElement) {
        content = textElement.textContent
      }
    }

    // 提取消息ID
    const messageId = element.getAttribute('data-message-id')

    if (content) {
      messages.push({
        id: messageId,
        role: isUser ? 'user' : (isAssistant ? 'assistant' : 'system'),
        content,
        timestamp: new Date().toISOString(), // DeepSeek可能不显示时间戳，使用当前时间
      })
    }
  })

  return {
    title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    messages,
  }
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
