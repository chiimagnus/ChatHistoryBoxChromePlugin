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
  "title": "微信公众号文章的网址是什么",
  "url": "https://chat.deepseek.com/a/chat/s/014e5956-cfc3-4ae9-9223-fb33b97a4070",
  "messages": [
    {
      "id": "user-0",
      "role": "user",
      "content": "微信公众号文章的网址是什么"
    },
    {
      "id": "ai-response-0",
      "role": "assistant",
      "content": "<p>服务器繁忙，请稍后再试。</p>",
      "rawText": "服务器繁忙，请稍后再试。"
    },
    {
      "id": "user-1",
      "role": "user",
      "content": "《微信公众号文章的网址是什么》"
    },
    {
      "id": "ai-thinking-1",
      "role": "thinking",
      "content": "好的，用户问微信公众号文章的网址是什么。首先，我需要确定用户的具体需求。微信公众号文章的链接通常以mp.weixin.qq.com开头，后面跟着一串参数。但用户可能不知道如何获取这些链接，或者他们可能遇到了什么问题。\n\n\n\n接下来，我得考虑用户为什么会问这个问题。可能的情况是，他们想分享自己的文章链接，或者想保存别人的文章链接，但不知道在哪里找到。也有可能是他们遇到了链接无法打开的问题，需要确认正确的格式。\n\n\n\n然后，我需要确认微信公众号文章的链接结构。通常，文章的URL是https://mp.weixin.qq.com/s/后面跟着随机字符。例如，用户可能看到的是这样的链接。不过，有时候用户可能复制了错误的链接，比如从微信内部打开时显示的临时链接，这种链接可能有时效性，过期后无法访问。\n\n\n\n另外，需要注意微信公众号文章的一些限制。比如，未认证的公众号文章可能无法被搜索引擎收录，或者只能在微信内部分享。用户可能误以为这些链接有问题，但其实这是正常现象。此外，原创文章可能有不同的处理方式，比如需要授权才能转载。\n\n\n\n用户可能还关心如何正确获取文章的永久链接。这时候需要指导他们通过公众号后台或者文章详情页获取正确的URL。同时，提醒他们注意链接的有效性，避免使用临时链接。\n\n\n\n还需要考虑用户是否有其他深层需求。比如，他们可能想将文章嵌入到自己的网站中，或者进行数据分析，这时候需要告知他们微信的限制，比如只能在微信内打开，无法直接外部访问。\n\n\n\n最后，总结回答时要清晰列出链接结构、获取方法以及常见问题，确保用户能全面理解。同时，使用友好的语气，避免使用过于专业的术语，让用户容易理解。"
    },
    {
      "id": "ai-response-1",
      "role": "assistant",
      "content": "<p>微信公众号文章的网址通常以 <code>https://mp.weixin.qq.com/s/</code> 开头，后跟一串由字母和数字组成的随机字符，例如：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\"></div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre>https://mp.weixin.qq.com/s/AbcDefGhiJklMnoPqRsTuV</pre></div><h3>注意事项：</h3><ol start=\"1\"><li><p><strong>如何获取链接</strong>：</p><ul><li><p>在微信内打开文章 → 点击右上角菜单（三个点）→ 选择“复制链接”。</p></li><li><p>通过公众号后台（电脑端）的文章管理</p></li></ul></li></ol>",
      "rawText": "微信公众号文章的网址通常以 https://mp.weixin.qq.com/s/ 开头，后跟一串由字母和数字组成的随机字符，例如：复制https://mp.weixin.qq.com/s/AbcDefGhiJklMnoPqRsTuV注意事项：如何获取链接：在微信内打开文章 → 点击右上角菜单（三个点）→ 选择“复制链接”。通过公众号后台（电脑端）的文章管理"
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "这一次是没有深度思考的对话"
    },
    {
      "id": "ai-response-2",
      "role": "assistant",
      "content": "<p>明白了！如果你有需要深入探讨的话题或问题，随时告诉我，我会尽力提供更有深度的分析和见解！😊 如果只是轻松的对话，我也会配合你，保持轻松愉快的氛围～ 有什么想聊的吗？</p>",
      "rawText": "明白了！如果你有需要深入探讨的话题或问题，随时告诉我，我会尽力提供更有深度的分析和见解！😊 如果只是轻松的对话，我也会配合你，保持轻松愉快的氛围～ 有什么想聊的吗？"
    }
  ]
}
```
</details>

<details>
<summary>content字段中包含的HTML标签类型</summary>

1. 基础标签：
- `<p>` - 段落标签
- `<div>` - 容器标签
- `<pre>` - 预格式化文本标签

2. 文本格式化标签：
- `<strong>` - 加粗文本
- `<code>` - 代码文本

3. 列表标签：
- `<ol>` - 有序列表，带有 start 属性
- `<ul>` - 无序列表
- `<li>` - 列表项

4. 其他标签：
- `<h3>` - 三级标题
- `<hr>` - 水平分割线
- `<a>` - 链接标签，带有 target 和 rel 属性
- `<span>` - 行内元素，带有 class 属性

5. 特殊结构：
- 代码块结构：使用`md-code-block` 相关的 class 来构建代码块界面
- 复制按钮功能：通过`ds-markdown-code-copy-button` class 实现

</details>
