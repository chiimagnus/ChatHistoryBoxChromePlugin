# ChatHistoryBox

一个简单的Chrome扩展，帮助你保存AI聊天对话记录为JSON文件。

## 功能介绍 ⭐
1. 在支持的AI聊天网站右下角添加一个下载按钮
2. 点击按钮时自动提取当前页面的所有聊天记录
3. 将聊天记录保存为JSON文件到你的电脑上
4. 支持多个AI聊天平台：
   - Deepseek Chat
   - 腾讯元宝
5. 支持提取多种类型的消息：
   - 用户提问
   - AI思考过程
   - AI最终回答

## 使用方法 ⭐
1. 安装扩展后，打开任意支持的AI聊天对话页面
2. 在页面右下角可以看到蓝色的下载按钮（💾）
3. 点击按钮，等待提取完成
4. 选择保存位置，完成下载

## 文件结构 ⭐

### 核心文件和文件夹
- `src/contentScripts/` - 这是最重要的文件夹
  - 包含我们的主要功能：聊天记录提取按钮和逻辑
  - `views/App.vue` - 这里实现了提取聊天记录的全部功能
  - `index.ts` - 负责将按钮注入到deepseek网页中
  - `extractors/` - 不同平台的聊天记录提取器
    - `BaseExtractor.ts` - 提取器基类，包含通用的HTML清理功能
    - `DeepseekExtractor.ts` - Deepseek平台特定提取器
    - `YuanbaoExtractor.ts` - 腾讯元宝平台特定提取器
- `src/manifest.ts` - 扩展的"身份证"
  - 定义了扩展需要的权限（下载、访问网站等）
  - 设置了内容脚本匹配的网站规则

### 次要文件夹
  - `src/popup/` - 点击浏览器工具栏图标显示的弹出窗口
  - `src/options/` - 扩展设置页面
  - `src/background/` - 后台服务脚本
  - `src/assets/` - 图标等资源文件

## 开发指南 ⭐

### 如何修改提取逻辑
如果DeepSeek网站的HTML结构发生变化，可能需要更新选择器。主要修改`src/contentScripts/extractors/DeepseekExtractor.ts`文件中的以下选择器：

```javascript
// 标题选择器
const titleElement = document.querySelector('div[class^="d8ed659a"]')

// 用户消息选择器
const userMessages = Array.from(document.querySelectorAll('div[class^="fbb"]'))

// AI思考消息选择器
const aiMessages = Array.from(document.querySelectorAll('div[class^="e16"]'))

// AI最终回答选择器
const aiResponseMessages = Array.from(document.querySelectorAll('div.ds-markdown.ds-markdown--block'))
```

如果腾讯元宝网站的HTML结构发生变化，可能需要更新选择器。主要修改`src/contentScripts/extractors/YuanbaoExtractor.ts`文件中的以下选择器：

```javascript
// 标题选择器
const titleElement = document.querySelector('span.t-button__text')

// 用户消息选择器
const userMessages = Array.from(document.querySelectorAll('div.hyc-content-text'))

// AI思考消息选择器
const aiThinkingElements = Array.from(document.querySelectorAll('div.hyc-component-reasoner__think-content'))

// AI最终回答选择器
const aiResponseElements = Array.from(document.querySelectorAll('div.hyc-component-reasoner__text'))
```

### 调试方法
1. 参考[vitesse-webext插件模版](https://github.com/antfu-collective/vitesse-webext)进行开发。
2. 在终端运行`pnpm install && pnpm run build`
3. 在Chrome浏览器中打开扩展管理页面 (`chrome://extensions/`)
4. 开启开发者模式
5. 点击"加载已解压的扩展程序"，选择`extension`文件夹
6. 打开Deepseek Chat页面
7. 按F12打开开发者工具，查看控制台输出

### deepseek-json文件效果
<details>
<summary>点击查看</summary>

```json
{
  "title": "SwiftUI添加JSON文档支持指南",
  "url": "https://chat.deepseek.com/a/chat/s/f37ffe6a-5ef1-49e5-af1d-e8a2128738dd",
  "messages": [
    {
      "id": "user-0",
      "role": "user",
      "content": "用户问题"
    },
    {
      "id": "ai-thinking-0",
      "role": "thinking",
      "content": "AI思考内容"
    },
    {
      "id": "ai-response-0",
      "role": "assistant",
      "content": "AI回复内容xxx"
    },
    {
      "id": "user-1",
      "role": "user",
      "content": "用户问题"
    },
    {
      "id": "ai-response-1",
      "role": "assistant",
      "content": "AI回复内容xxx（这里AI没有思考内容，所以就不存在ai-thinking-1）"
    }
  ],
  "metadata": {
    "extractTime": "2025-08-20T01:51:04.890Z",
    "version": "1.0.0",
    "platform": "deepseek"
  }
}
```
</details>
