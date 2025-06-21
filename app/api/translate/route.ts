import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== "string") {
      return Response.json({ error: "输入内容不能为空" }, { status: 400 })
    }

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY
    if (!OPENROUTER_KEY) {
      return Response.json({ error: "请在环境变量中配置 OPENROUTER_API_KEY" }, { status: 500 })
    }

    const openrouter = createOpenRouter({
      apiKey: OPENROUTER_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
        "X-Title": "Internet Buzzword Translator",
      },
    })

    const { text } = await generateText({
      // 使用正确的 Google Gemini 2.5 Flash 模型名称
      model: openrouter.chat("google/gemini-2.5-flash"),
      system: `你是一个互联网黑话专家，擅长将普通的大白话转化为听起来高大上的互联网黑话。

转换规则：
1. 将简单的概念包装成复杂但听起来专业的表述
2. 大量使用互联网营销术语，如：私域流量、用户心智、价值转化、流量变现、用户画像、场景化、生态闭环等
3. 将普通动作描述成战略性行为
4. 多使用数据驱动、精准营销、用户体验、品牌赋能等词汇
5. 保持语言的流畅性和逻辑性

示例转换：
普通话："我想做个群，发红包让大家活跃一下"
黑话："我的思路是将用户聚集在私域阵地，寻找用户痛点，抓住用户爽点，通过战略性亏损，扭转用户心智，从而达成价值转化"

普通话："我们要多发朋友圈宣传产品"  
黑话："我们需要通过社交媒体矩阵进行品牌曝光，利用内容营销策略，在用户心智中建立品牌认知，实现流量变现的闭环"

请将用户输入的普通话转换成互联网黑话，只返回转换后的结果，不要添加其他解释。`,
      prompt: `请将以下普通话转换成互联网黑话：${input}`,
      maxTokens: 500,
    })

    return Response.json({ output: text.trim() })
  } catch (error) {
    console.error("Translation error:", error)
    return Response.json({ error: "转换失败，请稍后重试" }, { status: 500 })
  }
}
