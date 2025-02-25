# ChatHistoryBox

一款保存与AI对话记录的浏览器扩展程序。

## 📦 功能特性
- **智能检测**：自动识别常见AI聊天界面
- **一键保存**：通过悬浮按钮快速保存对话
- **单一格式支持**：JSON保存格式
- **本地存储**：数据直接保存到用户设备

## TODOs
- [ ] 点击悬浮按钮，然后弹出"保存此页面对话"，点击此按钮然后就保存成功。
- [ ] 数据以json文件的形式，保存在用户的本地文件管理器中。

## 🛠 技术架构
```
ChatHistoryBoxChromePlugin/
├── src/
│   ├── popup/       # 弹出窗口的积木
│   ├── options/     # 设置页面的积木
│   ├── contentScript/ # 注入网页的积木
│   ├── background/  # 后台服务的积木
│   ├── components/  # 自动导入的Vue组件，在弹出窗口和设置页面中共享
│   ├── styles/      # 弹出窗口和设置页面共享的样式
│   ├── assets/      # 在Vue组件中使用的资源文件
│   └── manifest.ts  # 插件的身份证（名字/权限等）
├── extension/       # 打包后的成品积木
└── package.json     # 积木组装说明书
```

## 📍 使用说明

### 基本操作流程
1. 访问AI聊天网站（如DeepSeek）
2. 页面右下角出现💾按钮
3. 点击按钮自动保存对话记录
4. 文件下载到本地默认下载目录

## 问题分析
需要补充以下信息才能继续开发：
1. 请提供目标网站（如DeepSeek）的对话界面HTML结构示例，我需要根据实际DOM结构调整选择器

2. 是否需要支持多个AI服务（ChatGPT/Claude等）的对话保存？需要为每个服务编写特定的提取逻辑

3. 保存时是否需要包含元数据（如对话时间、模型版本等）？

建议下一步：

1. 先实现JSON格式的保存功能

2. 添加成功保存的反馈提示

3. 开发历史记录管理界面

4. 实现与Swift应用的数据同步机制
请告诉我你希望优先实现哪个部分，或者需要调整现有方案中的哪些设计。

## 致谢
本项目基于[vitesse-webext插件模版](https://github.com/antfu-collective/vitesse-webext)进行开发。
