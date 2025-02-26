# ChatHistoryBox

一个简单的Chrome扩展，帮助你保存Deepseek Chat对话记录为JSON文件。

## 功能介绍 ⭐
1. 在Deepseek Chat网站右下角添加一个下载按钮
2. 点击按钮时自动提取当前页面的所有聊天记录
3. 将聊天记录保存为JSON文件到你的电脑上
4. 支持提取三种类型的消息：
   - 用户提问
   - AI思考过程
   - AI最终回答（包括格式化内容）

## 使用方法 ⭐
1. 安装扩展后，打开任意Deepseek Chat对话页面
2. 在页面右下角可以看到蓝色的下载按钮（💾）
3. 点击按钮，等待提取完成
4. 选择保存位置，完成下载

## 文件结构 ⭐

### 核心文件和文件夹
- `src/contentScripts/` - 这是最重要的文件夹
  - 包含我们的主要功能：聊天记录提取按钮和逻辑
  - `views/App.vue` - 这里实现了提取聊天记录的全部功能
  - `index.ts` - 负责将按钮注入到deepseek网页中
- `src/manifest.ts` - 扩展的"身份证"
  - 定义了扩展需要的权限（下载、访问网站等）
  - 设置了内容脚本匹配的网站规则（deepseek.com/ai）

### 次要文件夹（暂不需要关注）
  - `src/popup/` - 点击浏览器工具栏图标显示的弹出窗口
  - `src/options/` - 扩展设置页面
  - `src/background/` - 后台服务脚本
  - `src/assets/` - 图标等资源文件

## 开发指南 ⭐

### 如何修改提取逻辑
如果DeepSeek网站的HTML结构发生变化，可能需要更新选择器。主要修改`src/contentScripts/views/App.vue`文件中的以下选择器：

```javascript
// 用户消息选择器
const userMessages = Array.from(document.querySelectorAll('div[class^="fbb"]'))

// AI思考消息选择器
const aiMessages = Array.from(document.querySelectorAll('div[class^="e16"]'))

// AI最终回答选择器
const aiResponseMessages = Array.from(document.querySelectorAll('div.ds-markdown.ds-markdown--block'))
```

### 调试方法
1. 参考[vitesse-webext插件模版](https://github.com/antfu-collective/vitesse-webext)进行开发。
2. 在终端运行`pnpm install && pnpm run build`
3. 在Chrome浏览器中打开扩展管理页面 (`chrome://extensions/`)
4. 开启开发者模式
5. 点击"加载已解压的扩展程序"，选择`extension`文件夹
6. 打开Deepseek Chat页面
7. 按F12打开开发者工具，查看控制台输出

### json文件效果
<details>
<summary>点击查看</summary>

```json
{
  "title": "DeepSeek - 探索未至之境",
  "url": "https://chat.deepseek.com/a/chat/s/14d6633d-bd30-4e6f-a294-03a9633f31bd",
  "messages": [
    {
      "id": "user-0",
      "role": "user",
      "content": "海南有哪些好玩的地方"
    },
    {
      "id": "ai-response-0",
      "role": "assistant",
      "content": "<p>海南xxx</p>",
      "rawText": "海南xxx"
    },
    {
      "id": "user-1",
      "role": "user",
      "content": "海南有哪些好玩的地方"
    },
    {
      "id": "ai-thinking-1",
      "role": "thinking",
      "content": "嗯，用户两次问了同样的问题，xxx"
    },
    {
      "id": "ai-response-1",
      "role": "assistant",
      "content": "<p>海南xxx：</p><hr><h3><strong>一、三亚（海岛度假天花板）</strong></h3><ol start=\"1\"><li><p><strong>亚龙湾</strong></p><ul><li><p>被誉为“天下第一湾”，海水清澈，适合游泳、潜水、冲浪。</p></li><li><p>周边高端酒店云集，适合度假躺平。</p></li></ul></li>",
      "rawText": "海南xxx"
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "我一个人去玩，应该会在海口下车,xxx"
    },
    {
      "id": "ai-thinking-2",
      "role": "thinking",
      "content": "好的，用户计划在海南玩五六天xxx"
    },
    {
      "id": "ai-response-2",
      "role": "assistant",
      "content": "<p>根据你的需求xxx：</p>",
      "rawText": "根据你的需求xxx"
    }
  ]
}
```

</details>
