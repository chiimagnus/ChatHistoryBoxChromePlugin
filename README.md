# ChatHistoryBox

一个简单的Chrome扩展，帮助你保存Deepseek Chat对话记录为JSON文件。

## 功能介绍 ⭐

1. 在Deepseek Chat网站右下角添加一个下载按钮
2. 点击按钮时自动提取当前页面的所有聊天记录
3. 将聊天记录保存为JSON文件到你的电脑上
4. 保存的文件包含对话标题、URL、时间戳和完整消息内容
5. 支持提取三种类型的消息：
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
  "url": "https://chat.deepseek.com/a/chat/s/40acb30a-0c4c-4260-848e-2fae5a619fc0",
  "timestamp": "2025-02-25T04:08:17.903Z",
  "messages": [
    {
      "id": "user-0",
      "role": "user",
      "content": "语音识别最好的模型还是whisper吗？我希望最好是能够支持多人识别啥的",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "ai-response-0",
      "role": "assistant",
      "content": "<p>截至2025年，语音识别领域已经涌现出多个性能卓越的模型，Whisper虽然仍然是一个强大的选择，但已经不再是唯一的最佳模型。以下是当前语音识别领域的一些最新进展和推荐模型，特别是针对多人识别的需求：</p><hr><h3>1. <strong>FireRedASR</strong> <span class=\"ds-markdown-cite\">5</span><span class=\"ds-markdown-cite\">7</span></h3><ul><li><p><strong>特点</strong>：小红书团队开源的FireRedASR模型在中文普通话公开测试集上取得了新的SOTA（State-of-the-Art）结果，字错误率（CER）显著降低。它支持多种语言和方言，且在歌词识别等复杂场景中表现出色。</p></li><li><p><strong>多人识别支持</strong>：虽然没有明确提到多人识别功能，但其强大的上下文建模能力和高精度识别使其可能适用于多人对话场景。</p></li><li><p><strong>适用场景</strong>：适合高精度需求的中文语音识别，尤其是复杂场景下的语音转写。</p></li></ul><hr><h3>2. <strong>CR-CTC（Consistency-Regularized CTC）</strong> <span class=\"ds-markdown-cite\">1</span><span class=\"ds-markdown-cite\">3</span></h3><ul><li><p><strong>特点</strong>：由小米新一代Kaldi团队提出，CR-CTC通过一致性正则化技术显著提升了CTC模型的性能，使其在多个主流数据集上达到了与Transducer和CTC/AED模型相当的水平。</p></li><li><p><strong>多人识别支持</strong>：CR-CTC的框架可以扩展为多人识别场景，尤其是在多说话人分离（如结合Voice Activity Detection, VAD）后进行处理。</p></li><li><p><strong>适用场景</strong>：适合需要高效率和低延迟的语音识别任务，尤其是在资源受限的环境中。</p></li></ul><hr><h3>3. <strong>SenseVoice</strong> <span class=\"ds-markdown-cite\">9</span></h3><ul><li><p><strong>特点</strong>：阿里开源的SenseVoice模型支持多语言语音识别、语种识别、语音情感识别和声学事件检测。其推理效率极高，处理10秒音频仅需70毫秒。</p></li><li><p><strong>多人识别支持</strong>：SenseVoice的声学事件检测能力可以用于区分不同说话人，结合多通道音频输入，可能实现多人识别。</p></li><li><p><strong>适用场景</strong>：适合多语言、多任务场景，尤其是需要实时处理的语音识别任务。</p></li></ul><hr><h3>4. <strong>云知声山海大模型</strong> <span class=\"ds-markdown-cite\">8</span></h3><ul><li><p><strong>特点</strong>：云知声的山海大模型在智能座舱语音交互中表现出色，支持复杂的上下文理解和多模态交互。其语音识别能力结合了降噪、回声消除等技术，适合嘈杂环境。</p></li><li><p><strong>多人识别支持</strong>：通过音区分离和多模态交互能力，山海大模型可以区分不同说话人，并实现多人对话的精准识别。</p></li><li><p><strong>适用场景</strong>：适合车载语音助手、智能家居等需要高鲁棒性和多说话人识别的场景。</p></li></ul><hr><h3>5. <strong>Whisper</strong> <span class=\"ds-markdown-cite\">9</span></h3><ul><li><p><strong>特点</strong>：Whisper仍然是开源的语音识别模型中的佼佼者，支持多语言识别，且在大规模数据集上训练，具有较高的通用性。</p></li><li><p><strong>多人识别支持</strong>：Whisper本身不直接支持多人识别，但可以结合其他技术（如说话人分离）实现多人场景的语音转写。</p></li><li><p><strong>适用场景</strong>：适合需要多语言支持的通用语音识别任务。</p></li></ul><hr><h3>6. <strong>科大讯飞星火语音同传大模型</strong> <span class=\"ds-markdown-cite\">10</span></h3><ul><li><p><strong>特点</strong>：科大讯飞的星火语音同传大模型在翻译和语音识别领域表现优异，支持流式处理和低延迟。</p></li><li><p><strong>多人识别支持</strong>：虽然主要面向翻译场景，但其流式处理能力可能适用于多人对话的实时识别。</p></li><li><p><strong>适用场景</strong>：适合需要实时翻译和语音识别的场景。</p></li></ul><hr><h3>总结与建议</h3><ul><li><p><strong>多人识别需求</strong>：如果您的重点是多人识别，推荐优先考虑<strong>云知声山海大模型</strong>或<strong>SenseVoice</strong>，这些模型在多说话人分离和上下文理解方面具有优势。</p></li><li><p><strong>高精度需求</strong>：对于高精度语音识别，<strong>FireRedASR</strong>和<strong>CR-CTC</strong>是当前的最佳选择。</p></li><li><p><strong>多语言支持</strong>：如果需要多语言支持，<strong>Whisper</strong>和<strong>SenseVoice</strong>是不错的选择。</p></li></ul><p>如果您需要更详细的技术实现或部署建议，可以参考相关项目的开源代码和文档<span class=\"ds-markdown-cite\">1</span><span class=\"ds-markdown-cite\">5</span><span class=\"ds-markdown-cite\">9</span>。</p>",
      "rawText": "截至2025年，语音识别领域已经涌现出多个性能卓越的模型，Whisper虽然仍然是一个强大的选择，但已经不再是唯一的最佳模型。以下是当前语音识别领域的一些最新进展和推荐模型，特别是针对多人识别的需求：1. FireRedASR 57特点：小红书团队开源的FireRedASR模型在中文普通话公开测试集上取得了新的SOTA（State-of-the-Art）结果，字错误率（CER）显著降低。它支持多种语言和方言，且在歌词识别等复杂场景中表现出色。多人识别支持：虽然没有明确提到多人识别功能，但其强大的上下文建模能力和高精度识别使其可能适用于多人对话场景。适用场景：适合高精度需求的中文语音识别，尤其是复杂场景下的语音转写。2. CR-CTC（Consistency-Regularized CTC） 13特点：由小米新一代Kaldi团队提出，CR-CTC通过一致性正则化技术显著提升了CTC模型的性能，使其在多个主流数据集上达到了与Transducer和CTC/AED模型相当的水平。多人识别支持：CR-CTC的框架可以扩展为多人识别场景，尤其是在多说话人分离（如结合Voice Activity Detection, VAD）后进行处理。适用场景：适合需要高效率和低延迟的语音识别任务，尤其是在资源受限的环境中。3. SenseVoice 9特点：阿里开源的SenseVoice模型支持多语言语音识别、语种识别、语音情感识别和声学事件检测。其推理效率极高，处理10秒音频仅需70毫秒。多人识别支持：SenseVoice的声学事件检测能力可以用于区分不同说话人，结合多通道音频输入，可能实现多人识别。适用场景：适合多语言、多任务场景，尤其是需要实时处理的语音识别任务。4. 云知声山海大模型 8特点：云知声的山海大模型在智能座舱语音交互中表现出色，支持复杂的上下文理解和多模态交互。其语音识别能力结合了降噪、回声消除等技术，适合嘈杂环境。多人识别支持：通过音区分离和多模态交互能力，山海大模型可以区分不同说话人，并实现多人对话的精准识别。适用场景：适合车载语音助手、智能家居等需要高鲁棒性和多说话人识别的场景。5. Whisper 9特点：Whisper仍然是开源的语音识别模型中的佼佼者，支持多语言识别，且在大规模数据集上训练，具有较高的通用性。多人识别支持：Whisper本身不直接支持多人识别，但可以结合其他技术（如说话人分离）实现多人场景的语音转写。适用场景：适合需要多语言支持的通用语音识别任务。6. 科大讯飞星火语音同传大模型 10特点：科大讯飞的星火语音同传大模型在翻译和语音识别领域表现优异，支持流式处理和低延迟。多人识别支持：虽然主要面向翻译场景，但其流式处理能力可能适用于多人对话的实时识别。适用场景：适合需要实时翻译和语音识别的场景。总结与建议多人识别需求：如果您的重点是多人识别，推荐优先考虑云知声山海大模型或SenseVoice，这些模型在多说话人分离和上下文理解方面具有优势。高精度需求：对于高精度语音识别，FireRedASR和CR-CTC是当前的最佳选择。多语言支持：如果需要多语言支持，Whisper和SenseVoice是不错的选择。如果您需要更详细的技术实现或部署建议，可以参考相关项目的开源代码和文档159。",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "user-1",
      "role": "user",
      "content": "我想知道，logseq中有没有读取本地文件，批量自动导入的插件？",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "ai-response-1",
      "role": "assistant",
      "content": "<p>服务器繁忙，请稍后再试。</p>",
      "rawText": "服务器繁忙，请稍后再试。",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "有没有一个类似于ollama管理几乎所有本地大模型的平台存在，来管理安装的语音识别、合成模型？",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "ai-thinking-2",
      "role": "thinking",
      "content": "嗯，用户问有没有类似于Ollama但能管理几乎所有本地大模型，特别是语音识别和合成模型的平台。首先，我需要回顾一下Ollama的功能。根据搜索结果，Ollama主要是用来运行和管理大型语言模型（LLM）的，比如Llama、Mistral这些，支持跨平台，通过命令行和API操作，还和Open WebUI之类的工具集成，提供了友好的界面。2610 但用户想要的是一个不仅能管理语言模型，还能处理语音识别和合成模型的平台。\n\n\n\n接下来，我要看看搜索结果中有没有提到其他类似工具。网页3比较了Ollama和LM Studio，提到LM Studio是一个闭源但功能全面的平台，适合非技术人员，有图形界面，可以管理模型并进行训练和评估。3 但不确定它是否支持语音模型。网页1介绍的LM Studio支持多种模型，包括语音相关的吗？网页1内容主要提到的是语言模型，比如Llama 3、Phi 3等，没有明确提到语音模型。1\n\n\n\n再看看LocalAI，网页5对比了Ollama和LocalAI，提到LocalAI支持多种开源模型，包括LLaMA、GPT-J等，并且可以在CPU上运行，适合自定义需求，可能更灵活。但同样，是否支持语音模型还不清楚。5 网页8提到LocalAI作为大模型框架之一，支持自定义训练，可能可以扩展。8\n\n\n\n网页4和6提到的Open WebUI主要是为Ollama提供Web界面，方便用户交互，但主要是针对语言模型。46 有没有其他工具能集成语音模型呢？网页7提到的Deepseek部署指南中，Ollama用于知识库应用，但没涉及语音。7\n\n\n\n可能需要考虑组合多个工具。例如，使用Ollama管理语言模型，再配合其他平台管理语音模型。但用户希望有一个统一的平台。有没有搜索结果提到这样的工具呢？网页2提到的LLaMA-Factory支持微调多种模型，包括语音相关的吗？网页2中的LLaMA-Factory主要是微调语言模型，比如LLaMA、ChatGLM等，没有提到语音。2\n\n\n\n可能没有直接提到的平台，但可以推荐一些接近的。比如LM Studio虽然主要针对语言模型，但其功能全面，可能通过扩展支持语音模型。或者LocalAI的灵活性较高，用户可以自行添加语音模型。另外，Dify在网页7中被提到可以结合Ollama和知识库，可能通过插件支持语音功能。7\n\n\n\n总结下来，目前没有完全符合用户需求的平台，但有几个接近的选项：LM Studio、LocalAI、Dify，以及组合使用Ollama和Open WebUI。需要指出这些工具的优缺点，并建议可能的解决方案，比如结合多个工具或自行扩展。同时，可以提到未来可能的发展方向，比如社区扩展支持语音模型。",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "ai-response-2",
      "role": "assistant",
      "content": "<p>根据搜索结果，目前没有单一平台能够完全覆盖<strong>所有本地大模型（包括语音识别、合成模型等）的集成管理</strong>，但以下工具和方案可以部分满足需求，或通过组合使用实现类似功能：</p><hr><h3>1. <strong>Ollama + Open WebUI 组合方案</strong><span class=\"ds-markdown-cite\">2</span><span class=\"ds-markdown-cite\">4</span><span class=\"ds-markdown-cite\">6</span></h3><ul><li><p><strong>功能特点</strong>：</p><ul><li><p><strong>Ollama</strong> 是当前最流行的本地大模型管理工具，支持多种语言模型（如 Llama、Mistral、Gemma、Qwen 等），通过命令行或 API 管理模型，支持跨平台运行（Windows、macOS、Linux）<span class=\"ds-markdown-cite\">6</span><span class=\"ds-markdown-cite\">10</span>。</p></li><li><p><strong>Open WebUI</strong> 是一个开源的 Web 界面，与 Ollama 深度集成，提供类似 ChatGPT 的交互界面，支持多模型切换、对话管理和本地 RAG（检索增强生成）<span class=\"ds-markdown-cite\">4</span><span class=\"ds-markdown-cite\">6</span>。</p></li></ul></li><li><p><strong>扩展性</strong>：</p><ul><li><p>虽然 Ollama 主要面向语言模型，但可通过社区扩展或自定义 Modelfile 加载其他类型的模型（如语音模型）<span class=\"ds-markdown-cite\">8</span><span class=\"ds-markdown-cite\">10</span>。</p></li><li><p>用户可结合语音识别工具（如 Whisper）的 API，将其集成到 Open WebUI 的插件生态中，实现多模态管理<span class=\"ds-markdown-cite\">6</span><span class=\"ds-markdown-cite\">8</span>。</p></li></ul></li></ul><hr><h3>2. <strong>LM Studio：闭源但功能全面的本地模型管理平台</strong></h3>",
      "rawText": "根据搜索结果，目前没有单一平台能够完全覆盖所有本地大模型（包括语音识别、合成模型等）的集成管理，但以下工具和方案可以部分满足需求，或通过组合使用实现类似功能：1. Ollama + Open WebUI 组合方案246功能特点：Ollama 是当前最流行的本地大模型管理工具，支持多种语言模型（如 Llama、Mistral、Gemma、Qwen 等），通过命令行或 API 管理模型，支持跨平台运行（Windows、macOS、Linux）610。Open WebUI 是一个开源的 Web 界面，与 Ollama 深度集成，提供类似 ChatGPT 的交互界面，支持多模型切换、对话管理和本地 RAG（检索增强生成）46。扩展性：虽然 Ollama 主要面向语言模型，但可通过社区扩展或自定义 Modelfile 加载其他类型的模型（如语音模型）810。用户可结合语音识别工具（如 Whisper）的 API，将其集成到 Open WebUI 的插件生态中，实现多模态管理68。2. LM Studio：闭源但功能全面的本地模型管理平台",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "不对，我想要的是更简单地部署语音识别模型（比如whisper、sensevoice）的app、开源项目。2 / 2",
      "timestamp": "2025-02-25T04:08:17.902Z"
    },
    {
      "id": "ai-response-3",
      "role": "assistant",
      "content": "<p>如果您希望更简单地部署语音识别模型（如 Whisper 或 SenseVoice），以下是一些推荐的 <strong>开源项目</strong> 和 <strong>工具</strong>，它们提供了更便捷的部署方式，通常通过 WebUI 或 API 实现，适合快速上手和使用：</p><hr><h3>1. <strong>SenseVoice WebUI</strong></h3><ul><li><p><strong>特点</strong>：SenseVoice 是阿里开源的多功能语音识别模型，支持多语言识别、情感识别和音频事件检测。其 WebUI 提供了图形化界面，用户可以通过上传音频文件直接进行语音转文字操作。</p></li><li><p><strong>部署方式</strong>：</p><ol start=\"1\"><li><p>克隆项目并创建虚拟环境：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">bash</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre><span class=\"token function\">git</span> clone https://github.com/FunAudioLLM/SenseVoice.git\n<span class=\"token builtin class-name\">cd</span> SenseVoice\nconda create <span class=\"token parameter variable\">-n</span> sensevoice <span class=\"token assign-left variable\">python</span><span class=\"token operator\">=</span><span class=\"token number\">3.8</span>\nconda activate sensevoice</pre></div></li><li><p>安装依赖并启动 WebUI：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">bash</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre>pip <span class=\"token function\">install</span> <span class=\"token parameter variable\">-r</span> requirements.txt\npython webui.py</pre></div></li><li><p>访问 <code>http://localhost:7860</code> 即可使用 Web 界面进行语音识别<span class=\"ds-markdown-cite\">2</span><span class=\"ds-markdown-cite\">4</span><span class=\"ds-markdown-cite\">7</span>。</p></li></ol></li><li><p><strong>优点</strong>：支持多语言、情感识别，推理速度快（10 秒音频仅需 70 毫秒），适合快速部署和测试<span class=\"ds-markdown-cite\">6</span><span class=\"ds-markdown-cite\">7</span>。</p></li></ul><hr><h3>2. <strong>Whisper WebUI</strong></h3><ul><li><p><strong>特点</strong>：Whisper 是 OpenAI 开源的语音识别模型，支持多语言转录和字幕生成。通过社区开发的 WebUI 项目，可以更方便地使用 Whisper 进行语音转文字。</p></li><li><p><strong>部署方式</strong>：</p><ol start=\"1\"><li><p>安装 Whisper 和依赖：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">bash</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre>pip <span class=\"token function\">install</span> git+https://github.com/openai/whisper.git\npip <span class=\"token function\">install</span> gradio</pre></div></li><li><p>使用以下代码启动 WebUI：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">python</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre><span class=\"token keyword\">import</span> whisper\n<span class=\"token keyword\">import</span> gradio <span class=\"token keyword\">as</span> gr\n\nmodel <span class=\"token operator\">=</span> whisper<span class=\"token punctuation\">.</span>load_model<span class=\"token punctuation\">(</span><span class=\"token string\">\"base\"</span><span class=\"token punctuation\">)</span>\n\n<span class=\"token keyword\">def</span> <span class=\"token function\">transcribe</span><span class=\"token punctuation\">(</span>audio<span class=\"token punctuation\">)</span><span class=\"token punctuation\">:</span>\n    result <span class=\"token operator\">=</span> model<span class=\"token punctuation\">.</span>transcribe<span class=\"token punctuation\">(</span>audio<span class=\"token punctuation\">)</span>\n    <span class=\"token keyword\">return</span> result<span class=\"token punctuation\">[</span><span class=\"token string\">\"text\"</span><span class=\"token punctuation\">]</span>\n\ngr<span class=\"token punctuation\">.</span>Interface<span class=\"token punctuation\">(</span>fn<span class=\"token operator\">=</span>transcribe<span class=\"token punctuation\">,</span> inputs<span class=\"token operator\">=</span><span class=\"token string\">\"audio\"</span><span class=\"token punctuation\">,</span> outputs<span class=\"token operator\">=</span><span class=\"token string\">\"text\"</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">.</span>launch<span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span></pre></div></li><li><p>访问 <code>http://localhost:7860</code> 即可使用<span class=\"ds-markdown-cite\">3</span><span class=\"ds-markdown-cite\">9</span>。</p></li></ol></li><li><p><strong>优点</strong>：Whisper 支持多种音频格式，模型大小可选（tiny、base、small、medium、large），适合不同场景需求<span class=\"ds-markdown-cite\">3</span><span class=\"ds-markdown-cite\">9</span>。</p></li></ul><hr><h3>3. <strong>FunASR 语音识别服务</strong></h3><ul><li><p><strong>特点</strong>：FunASR 是阿里开源的语音识别框架，支持高精度识别和实时推理。其 FastAPI 部署方式可以将模型封装为 API 服务，方便集成到其他应用中。</p></li><li><p><strong>部署方式</strong>：</p><ol start=\"1\"><li><p>克隆项目并安装依赖：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">bash</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre><span class=\"token function\">git</span> clone https://github.com/FunAudioLLM/SenseVoice.git\npip <span class=\"token function\">install</span> <span class=\"token parameter variable\">-r</span> requirements.txt</pre></div></li><li><p>使用 FastAPI 部署服务：</p><div class=\"md-code-block\"><div class=\"md-code-block-banner-wrap\"><div class=\"md-code-block-banner\"><div class=\"md-code-block-infostring\">python</div><div class=\"md-code-block-action\"><div class=\"ds-markdown-code-copy-button\">复制</div></div></div></div><pre><span class=\"token keyword\">import</span> torch\n<span class=\"token keyword\">import</span> uvicorn\n<span class=\"token keyword\">from</span> fastapi <span class=\"token keyword\">import</span> FastAPI\n<span class=\"token keyword\">from</span> funasr <span class=\"token keyword\">import</span> AutoModel\n\napp <span class=\"token operator\">=</span> FastAPI<span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span>\nmodel <span class=\"token operator\">=</span> AutoModel<span class=\"token punctuation\">(</span>model<span class=\"token operator\">=</span><span class=\"token string\">\"iic/SenseVoiceSmall\"</span><span class=\"token punctuation\">,</span> device<span class=\"token operator\">=</span><span class=\"token string\">\"cuda:0\"</span><span class=\"token punctuation\">)</span>\n\n<span class=\"token decorator annotation punctuation\">@app<span class=\"token punctuation\">.</span>post</span><span class=\"token punctuation\">(</span><span class=\"token string\">\"/asr\"</span><span class=\"token punctuation\">)</span>\n<span class=\"token keyword\">async</span> <span class=\"token keyword\">def</span> <span class=\"token function\">asr</span><span class=\"token punctuation\">(</span>audio<span class=\"token punctuation\">:</span> <span class=\"token builtin\">str</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">:</span>\n    result <span class=\"token operator\">=</span> model<span class=\"token punctuation\">.</span>generate<span class=\"token punctuation\">(</span>audio<span class=\"token punctuation\">)</span>\n    <span class=\"token keyword\">return</span> <span class=\"token punctuation\">{</span><span class=\"token string\">\"text\"</span><span class=\"token punctuation\">:</span> result<span class=\"token punctuation\">[</span><span class=\"token number\">0</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">[</span><span class=\"token string\">\"text\"</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">}</span>\n\n<span class=\"token keyword\">if</span> __name__ <span class=\"token operator\">==</span> <span class=\"token string\">\"__main__\"</span><span class=\"token punctuation\">:</span>\n    uvicorn<span class=\"token punctuation\">.</span>run<span class=\"token punctuation\">(</span>app<span class=\"token punctuation\">,</span> host<span class=\"token operator\">=</span><span class=\"token string\">\"0.0.0.0\"</span><span class=\"token punctuation\">,</span> port<span class=\"token operator\">=</span><span class=\"token number\">2002</span><span class=\"token punctuation\">)</span></pre></div></li><li><p>访问 <code>http://localhost:2002/asr</code> 即可调用 API<span class=\"ds-markdown-cite\">6</span><span class=\"ds-markdown-cite\">7</span>。</p></li></ol></li><li><p><strong>优点</strong>：支持高并发请求，适合需要集成到其他系统的场景<span class=\"ds-markdown-cite\">6</span><span class=\"ds-markdown-cite\">7</span>。</p></li></ul><hr><h3>4. <strong>Whisper Desktop (GUI 工具)</strong></h3><ul><li><p><strong>特点</strong>：Whisper Desktop 是一个基于 Whisper 的桌面应用程序，提供图形化界面，用户可以直接拖拽音频文件进行转录。</p></li><li><p><strong>部署方式</strong>：</p><ol start=\"1\"><li><p>下载 Whisper Desktop 的安装包（支持 Windows、macOS、Linux）。</p></li><li><p>安装并运行应用程序，选择音频文件即可进行转录。</p></li></ol></li><li><p><strong>优点</strong>：无需命令行操作，适合非技术用户使用。</p></li></ul><hr><h3>5. <strong>LM Studio + Whisper 插件</strong></h3><ul><li><p><strong>特点</strong>：LM Studio 是一个本地大模型管理工具，支持加载 Whisper 模型并通过插件实现语音识别功能。</p></li><li><p><strong>部署方式</strong>：</p><ol start=\"1\"><li><p>下载并安装 LM Studio。</p></li><li><p>加载 Whisper 模型并安装语音识别插件。</p></li><li><p>通过图形化界面进行语音转文字操作。</p></li></ol></li><li><p><strong>优点</strong>：支持多种模型管理，适合需要同时管理多个模型的用户。</p></li></ul><hr><h3>总结</h3><ul><li><p><strong>快速上手</strong>：推荐使用 <strong>SenseVoice WebUI</strong> 或 <strong>Whisper WebUI</strong>，它们提供了图形化界面，适合快速测试和部署。</p></li><li><p><strong>API 集成</strong>：如果需要将语音识别集成到其他应用中，可以选择 <strong>FunASR FastAPI 部署</strong>。</p></li><li><p><strong>桌面应用</strong>：对于非技术用户，<strong>Whisper Desktop</strong> 是一个不错的选择。</p></li></ul><p>如果您需要更详细的部署步骤或代码示例，可以参考上述项目的 GitHub 仓库或相关文档。</p>",
      "rawText": "如果您希望更简单地部署语音识别模型（如 Whisper 或 SenseVoice），以下是一些推荐的 开源项目 和 工具，它们提供了更便捷的部署方式，通常通过 WebUI 或 API 实现，适合快速上手和使用：1. SenseVoice WebUI特点：SenseVoice 是阿里开源的多功能语音识别模型，支持多语言识别、情感识别和音频事件检测。其 WebUI 提供了图形化界面，用户可以通过上传音频文件直接进行语音转文字操作。部署方式：克隆项目并创建虚拟环境：bash复制git clone https://github.com/FunAudioLLM/SenseVoice.git\ncd SenseVoice\nconda create -n sensevoice python=3.8\nconda activate sensevoice安装依赖并启动 WebUI：bash复制pip install -r requirements.txt\npython webui.py访问 http://localhost:7860 即可使用 Web 界面进行语音识别247。优点：支持多语言、情感识别，推理速度快（10 秒音频仅需 70 毫秒），适合快速部署和测试67。2. Whisper WebUI特点：Whisper 是 OpenAI 开源的语音识别模型，支持多语言转录和字幕生成。通过社区开发的 WebUI 项目，可以更方便地使用 Whisper 进行语音转文字。部署方式：安装 Whisper 和依赖：bash复制pip install git+https://github.com/openai/whisper.git\npip install gradio使用以下代码启动 WebUI：python复制import whisper\nimport gradio as gr\n\nmodel = whisper.load_model(\"base\")\n\ndef transcribe(audio):\n    result = model.transcribe(audio)\n    return result[\"text\"]\n\ngr.Interface(fn=transcribe, inputs=\"audio\", outputs=\"text\").launch()访问 http://localhost:7860 即可使用39。优点：Whisper 支持多种音频格式，模型大小可选（tiny、base、small、medium、large），适合不同场景需求39。3. FunASR 语音识别服务特点：FunASR 是阿里开源的语音识别框架，支持高精度识别和实时推理。其 FastAPI 部署方式可以将模型封装为 API 服务，方便集成到其他应用中。部署方式：克隆项目并安装依赖：bash复制git clone https://github.com/FunAudioLLM/SenseVoice.git\npip install -r requirements.txt使用 FastAPI 部署服务：python复制import torch\nimport uvicorn\nfrom fastapi import FastAPI\nfrom funasr import AutoModel\n\napp = FastAPI()\nmodel = AutoModel(model=\"iic/SenseVoiceSmall\", device=\"cuda:0\")\n\n@app.post(\"/asr\")\nasync def asr(audio: str):\n    result = model.generate(audio)\n    return {\"text\": result[0][\"text\"]}\n\nif __name__ == \"__main__\":\n    uvicorn.run(app, host=\"0.0.0.0\", port=2002)访问 http://localhost:2002/asr 即可调用 API67。优点：支持高并发请求，适合需要集成到其他系统的场景67。4. Whisper Desktop (GUI 工具)特点：Whisper Desktop 是一个基于 Whisper 的桌面应用程序，提供图形化界面，用户可以直接拖拽音频文件进行转录。部署方式：下载 Whisper Desktop 的安装包（支持 Windows、macOS、Linux）。安装并运行应用程序，选择音频文件即可进行转录。优点：无需命令行操作，适合非技术用户使用。5. LM Studio + Whisper 插件特点：LM Studio 是一个本地大模型管理工具，支持加载 Whisper 模型并通过插件实现语音识别功能。部署方式：下载并安装 LM Studio。加载 Whisper 模型并安装语音识别插件。通过图形化界面进行语音转文字操作。优点：支持多种模型管理，适合需要同时管理多个模型的用户。总结快速上手：推荐使用 SenseVoice WebUI 或 Whisper WebUI，它们提供了图形化界面，适合快速测试和部署。API 集成：如果需要将语音识别集成到其他应用中，可以选择 FunASR FastAPI 部署。桌面应用：对于非技术用户，Whisper Desktop 是一个不错的选择。如果您需要更详细的部署步骤或代码示例，可以参考上述项目的 GitHub 仓库或相关文档。",
      "timestamp": "2025-02-25T04:08:17.903Z"
    },
    {
      "id": "user-4",
      "role": "user",
      "content": "请问GitHub上有哪些开源的语音识别模型？我的需求就是精准1 / 3",
      "timestamp": "2025-02-25T04:08:17.903Z"
    },
    {
      "id": "ai-response-4",
      "role": "assistant",
      "content": "<p>GitHub 上有许多开源的语音识别模型，以下是一些精准且热门的语音识别模型推荐，适合不同场景和需求：</p><hr><h3>1. <strong>Whisper</strong></h3><ul><li><p><strong>特点</strong>：由 OpenAI 开发，支持多语言转录和翻译，训练数据量高达 68 万小时，具有较高的鲁棒性和准确性。支持多种音频格式（如 MP3、WAV 等），并提供五种不同大小的模型（tiny、base、small、medium、large），适合不同计算资源需求<span class=\"ds-markdown-cite\">1</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>支持 99 种语言的转录和翻译。</p></li><li><p>零样本性能优异，错误率较低。</p></li><li><p>免费使用，适合私有化部署。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>大型模型对 GPU 资源需求较高。</p></li><li><p>不支持实时转录。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/openai/whisper\" target=\"_blank\" rel=\"noreferrer\">Whisper</a></p></li></ul><hr><h3>2. <strong>DeepSpeech</strong></h3><ul><li><p><strong>特点</strong>：由 Mozilla 开发，基于百度深度语音研究论文，支持端到端训练和多语言转录。使用 TensorFlow 实现，适合定制化开发<span class=\"ds-markdown-cite\">1</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>支持 Python、C、.Net Framework 和 JavaScript 等多种开发语言。</p></li><li><p>在小型设备（如 Raspberry Pi）上运行良好。</p></li><li><p>每字错误率低至 7.5%。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>Mozilla 已停止维护该项目，社区支持有限。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/mozilla/DeepSpeech\" target=\"_blank\" rel=\"noreferrer\">DeepSpeech</a></p></li></ul><hr><h3>3. <strong>Kaldi</strong></h3><ul><li><p><strong>特点</strong>：专为语音识别研究设计，支持隐马尔可夫模型（HMM）、高斯混合模型（GMM）和深度学习模型。适合学术和工业研究<span class=\"ds-markdown-cite\">1</span><span class=\"ds-markdown-cite\">5</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>高度模块化，支持多种语音识别任务。</p></li><li><p>社区活跃，文档丰富。</p></li><li><p>适合高精度、复杂场景的语音识别。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>安装和使用复杂，适合有技术经验的用户。</p></li><li><p>对计算资源需求较高。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/kaldi-asr/kaldi\" target=\"_blank\" rel=\"noreferrer\">Kaldi</a></p></li></ul><hr><h3>4. <strong>PaddleSpeech</strong></h3><ul><li><p><strong>特点</strong>：由百度飞桨团队开发，支持语音识别、语音合成、翻译等任务，特别优化了中文语音识别<span class=\"ds-markdown-cite\">1</span><span class=\"ds-markdown-cite\">5</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>提供多种预训练模型（如 DeepSpeech2、Conformer 等）。</p></li><li><p>支持 Windows、macOS 和 Linux 等多平台。</p></li><li><p>中文识别性能优异。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>对其他语言的支持相对有限。</p></li><li><p>学习曲线较陡峭。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/PaddlePaddle/PaddleSpeech\" target=\"_blank\" rel=\"noreferrer\">PaddleSpeech</a></p></li></ul><hr><h3>5. <strong>Wenet</strong></h3><ul><li><p><strong>特点</strong>：由出门问问和西北工业大学联合开发，专注于端到端语音识别，适合工业落地应用<span class=\"ds-markdown-cite\">5</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>实时率和延迟性表现优异。</p></li><li><p>支持流式语音识别。</p></li><li><p>社区活跃，文档详细。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>安装和配置较为复杂。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/wenet-e2e/wenet\" target=\"_blank\" rel=\"noreferrer\">Wenet</a></p></li></ul><hr><h3>6. <strong>Vosk</strong></h3><ul><li><p><strong>特点</strong>：轻量级语音识别引擎，支持 20 多种语言，适合离线运行（如 Android、iOS、Raspberry Pi）<span class=\"ds-markdown-cite\">1</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>模型体积小（最小 50MB），响应速度快。</p></li><li><p>支持多种编程语言（如 Python、Java、C++ 等）。</p></li><li><p>适合隐私敏感场景。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>大型模型占用空间较大（最高 1.4GB）。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/alphacep/vosk-api\" target=\"_blank\" rel=\"noreferrer\">Vosk</a></p></li></ul><hr><h3>7. <strong>SenseVoice</strong></h3><ul><li><p><strong>特点</strong>：由阿里开源，支持多语言识别、情感识别和声学事件检测，推理速度快（10 秒音频仅需 70 毫秒）<span class=\"ds-markdown-cite\">1</span>。</p></li><li><p><strong>优点</strong>：</p><ul><li><p>支持多任务处理（如语音识别、情感分析）。</p></li><li><p>适合实时处理和高精度需求。</p></li></ul></li><li><p><strong>缺点</strong>：</p><ul><li><p>文档和社区支持相对较少。</p></li></ul></li><li><p><strong>GitHub 地址</strong>：<a href=\"https://github.com/FunAudioLLM/SenseVoice\" target=\"_blank\" rel=\"noreferrer\">SenseVoice</a></p></li></ul><hr><h3>总结</h3><ul><li><p><strong>高精度需求</strong>：推荐 <strong>Whisper</strong> 或 <strong>Kaldi</strong>，它们在多语言和复杂场景下表现优异。</p></li><li><p><strong>中文优化</strong>：<strong>PaddleSpeech</strong> 和 <strong>Wenet</strong> 是中文语音识别的最佳选择。</p></li><li><p><strong>轻量级和离线运行</strong>：<strong>Vosk</strong> 和 <strong>DeepSpeech</strong> 适合资源受限的环境。</p></li><li><p><strong>多任务处理</strong>：<strong>SenseVoice</strong> 支持语音识别、情感分析等多功能。</p></li></ul><p>如果需要更详细的技术实现或部署建议，可以参考上述项目的 GitHub 仓库和文档。</p>",
      "rawText": "GitHub 上有许多开源的语音识别模型，以下是一些精准且热门的语音识别模型推荐，适合不同场景和需求：1. Whisper特点：由 OpenAI 开发，支持多语言转录和翻译，训练数据量高达 68 万小时，具有较高的鲁棒性和准确性。支持多种音频格式（如 MP3、WAV 等），并提供五种不同大小的模型（tiny、base、small、medium、large），适合不同计算资源需求1。优点：支持 99 种语言的转录和翻译。零样本性能优异，错误率较低。免费使用，适合私有化部署。缺点：大型模型对 GPU 资源需求较高。不支持实时转录。GitHub 地址：Whisper2. DeepSpeech特点：由 Mozilla 开发，基于百度深度语音研究论文，支持端到端训练和多语言转录。使用 TensorFlow 实现，适合定制化开发1。优点：支持 Python、C、.Net Framework 和 JavaScript 等多种开发语言。在小型设备（如 Raspberry Pi）上运行良好。每字错误率低至 7.5%。缺点：Mozilla 已停止维护该项目，社区支持有限。GitHub 地址：DeepSpeech3. Kaldi特点：专为语音识别研究设计，支持隐马尔可夫模型（HMM）、高斯混合模型（GMM）和深度学习模型。适合学术和工业研究15。优点：高度模块化，支持多种语音识别任务。社区活跃，文档丰富。适合高精度、复杂场景的语音识别。缺点：安装和使用复杂，适合有技术经验的用户。对计算资源需求较高。GitHub 地址：Kaldi4. PaddleSpeech特点：由百度飞桨团队开发，支持语音识别、语音合成、翻译等任务，特别优化了中文语音识别15。优点：提供多种预训练模型（如 DeepSpeech2、Conformer 等）。支持 Windows、macOS 和 Linux 等多平台。中文识别性能优异。缺点：对其他语言的支持相对有限。学习曲线较陡峭。GitHub 地址：PaddleSpeech5. Wenet特点：由出门问问和西北工业大学联合开发，专注于端到端语音识别，适合工业落地应用5。优点：实时率和延迟性表现优异。支持流式语音识别。社区活跃，文档详细。缺点：安装和配置较为复杂。GitHub 地址：Wenet6. Vosk特点：轻量级语音识别引擎，支持 20 多种语言，适合离线运行（如 Android、iOS、Raspberry Pi）1。优点：模型体积小（最小 50MB），响应速度快。支持多种编程语言（如 Python、Java、C++ 等）。适合隐私敏感场景。缺点：大型模型占用空间较大（最高 1.4GB）。GitHub 地址：Vosk7. SenseVoice特点：由阿里开源，支持多语言识别、情感识别和声学事件检测，推理速度快（10 秒音频仅需 70 毫秒）1。优点：支持多任务处理（如语音识别、情感分析）。适合实时处理和高精度需求。缺点：文档和社区支持相对较少。GitHub 地址：SenseVoice总结高精度需求：推荐 Whisper 或 Kaldi，它们在多语言和复杂场景下表现优异。中文优化：PaddleSpeech 和 Wenet 是中文语音识别的最佳选择。轻量级和离线运行：Vosk 和 DeepSpeech 适合资源受限的环境。多任务处理：SenseVoice 支持语音识别、情感分析等多功能。如果需要更详细的技术实现或部署建议，可以参考上述项目的 GitHub 仓库和文档。",
      "timestamp": "2025-02-25T04:08:17.903Z"
    },
    {
      "id": "user-5",
      "role": "user",
      "content": "请问GitHub上有哪些开源的语音识别模型？我的需求就是精准",
      "timestamp": "2025-02-25T04:08:17.903Z"
    },
    {
      "id": "ai-response-5",
      "role": "assistant",
      "content": "<p>服务器繁忙，请稍后再试。</p>",
      "rawText": "服务器繁忙，请稍后再试。",
      "timestamp": "2025-02-25T04:08:17.903Z"
    }
  ]
}
```

</details>
