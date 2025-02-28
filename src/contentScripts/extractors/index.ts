/**
 * 提取器模块索引文件
 * 导出所有提取器相关的类和接口，方便在其他文件中引用
 */

// 导出基础提取器和类型定义
export { BaseExtractor } from './BaseExtractor'
export type { ChatData, ChatMessage } from './BaseExtractor'

// 导出具体平台的提取器实现
export { DeepseekExtractor } from './DeepseekExtractor'
export { YuanbaoExtractor } from './YuanbaoExtractor'

// 导出提取器工厂
export { ExtractorFactory } from './ExtractorFactory'
