# ChatHistoryBox

一个简单的Chrome扩展，帮助你保存Deepseek Chat对话记录为JSON文件。

## 功能介绍

1. 在Deepseek Chat网站右下角添加一个下载按钮
2. 点击按钮时自动提取当前页面的所有聊天记录
3. 将聊天记录保存为JSON文件到你的电脑上
4. 保存的文件包含对话标题、URL、时间戳和完整消息内容

## 使用方法

1. 安装扩展后，打开任意Deepseek Chat对话页面
2. 在页面右下角可以看到蓝色的下载按钮（💾）
3. 点击按钮，等待提取完成
4. 选择保存位置，完成下载

## 文件结构
### 核心文件和文件夹 ⭐

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
