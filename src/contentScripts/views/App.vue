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

  // 查找所有对话元素
  // 我们寻找所有顶级对话容器，包括用户问题和AI回答
  const userMessages = Array.from(document.querySelectorAll('div[class^="fbb"]')) // 用户消息
  const aiMessages = Array.from(document.querySelectorAll('div[class^="e16"]')) // AI思考消息
  const aiResponseMessages = Array.from(document.querySelectorAll('div.ds-markdown.ds-markdown--block')) // AI最终回答

  // eslint-disable-next-line no-console
  console.log('找到的消息数量:', {
    用户消息: userMessages.length,
    AI思考: aiMessages.length,
    AI回答: aiResponseMessages.length,
  })

  if (userMessages.length === 0 && aiResponseMessages.length === 0) {
    return null // 未找到任何消息
  }

  // 提取聊天标题
  const titleElement = document.querySelector('title')
  const title = titleElement ? titleElement.textContent.trim() : 'DeepSeek对话'

  // 构建消息数组
  const messages = []

  // 添加用户消息
  userMessages.forEach((element, index) => {
    const text = element.textContent.trim()
    if (text) {
      messages.push({
        id: `user-${index}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // 添加AI思考消息 (可选，如果需要的话)
  aiMessages.forEach((element, index) => {
    const paragraphs = Array.from(element.querySelectorAll('p[class^="ba9"]'))
    if (paragraphs.length > 0) {
      const text = paragraphs.map(p => p.textContent.trim()).join('\n\n')
      if (text) {
        messages.push({
          id: `ai-thinking-${index}`,
          role: 'thinking',
          content: text,
          timestamp: new Date().toISOString(),
        })
      }
    }
  })

  // 添加AI最终回答
  aiResponseMessages.forEach((element, index) => {
    // 提取HTML内容以保留格式
    const content = element.innerHTML
    if (content) {
      messages.push({
        id: `ai-response-${index}`,
        role: 'assistant',
        content,
        rawText: element.textContent.trim(),
        timestamp: new Date().toISOString(),
      })
    }
  })

  // 按页面自然顺序排序消息
  messages.sort((a, b) => {
    const idNumA = Number.parseInt(a.id.split('-')[1], 10)
    const idNumB = Number.parseInt(b.id.split('-')[1], 10)
    return idNumA - idNumB
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
