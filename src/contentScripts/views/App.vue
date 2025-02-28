<script setup lang="ts">
import { ref } from 'vue'
import 'uno.css'
import { ExtractorFactory } from '../extractors'

// 状态管理
const isExtracting = ref(false)
const extractionStatus = ref('')
const showToast = ref(false)

// 创建提取器实例
const extractor = ExtractorFactory.createExtractor()

// 提取聊天记录的主函数
async function extractChatHistory() {
  try {
    isExtracting.value = true
    extractionStatus.value = '正在提取聊天记录...'
    showToast.value = true

    // 使用提取器提取聊天记录
    await extractor.extractChatHistory()
    extractionStatus.value = '聊天记录已保存!'

    // 3秒后隐藏提示
    setTimeout(() => {
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
