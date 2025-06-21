# 互联网黑话生成器

这是一个使用 Next.js 和人工智能技术构建的 "互联网黑话生成器"。它可以将输入的普通话转换成听起来 "高大上" 的互联网行业术语，并能将生成的文本通过语音朗读出来。

## ✨ 核心功能

- **文本转换**: 输入一句话，通过调用 AI 模型（经由 OpenRouter 的 Google Gemini）将其转换成互联网黑话。
- **语音生成**: 将转换后的黑话文本通过 Fal.ai 的文本到语音（TTS）服务生成音频，并支持在线播放。
- **响应式设计**: 使用 Tailwind CSS 构建，在桌面和移动设备上都有良好的用户体验。
- **简单易用**: 简洁的界面，提供一键转换、复制和播放功能。

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) (React)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/)
- **包管理器**: [pnpm](https://pnpm.io/)
- **AI 服务**:
  - 文本生成: [OpenRouter](https://openrouter.ai/) (代理 Google Gemini 模型)
  - 语音生成: [Fal.ai](https://fal.ai/)

## 🚀 本地启动指南

请按照以下步骤在你的本地环境中运行此项目。

### 1. 克隆仓库

```bash
git clone <your-repository-url>
cd internet-buzzword-translator
```

### 2. 安装依赖

本项目使用 `pnpm` 作为包管理器。

如果你没有安装 `pnpm`，可以先通过 `npm` 安装：
```bash
npm install -g pnpm
```

然后安装项目依赖：
```bash
pnpm install
```

### 3. 配置环境变量

项目需要两个 API Key 才能正常工作。请在项目根目录下创建一个名为 `.env.local` 的文件，并填入以下内容：

```env
OPENROUTER_API_KEY="在这里填入你的 OpenRouter API Key"
FAL_KEY="在这里填入你的 Fal.ai API Key"
```

- `OPENROUTER_API_KEY`: 前往 [OpenRouter.ai](https://openrouter.ai/) 注册并获取你的 Key。
- `FAL_KEY`: 前往 [Fal.ai](https://fal.ai/) 注册并获取你的 Key。

### 4. 启动开发服务器

完成以上步骤后，运行以下命令启动项目：

```bash
pnpm dev
```

现在，你可以在浏览器中打开 `http://localhost:3000` (或终端提示的其他端口) 来访问该应用。

## 📁 项目结构

```
.
├── app/                  # Next.js 13+ App Router 目录
│   ├── api/              # 后端 API 路由
│   │   ├── translate/    # 处理文本转换的 API
│   │   └── text-to-speech/ # 处理语音生成的 API
│   └── page.tsx        # 应用主页
├── components/           # React 组件
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具函数或库的配置
├── public/               # 静态资源
├── styles/               # 全局样式
├── .env.local            # 本地环境变量 (需要手动创建)
├── next.config.mjs       # Next.js 配置文件
├── package.json          # 项目依赖和脚本
└── README.md             # 项目文档
``` 