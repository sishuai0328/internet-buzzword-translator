export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return Response.json({ error: "文本内容不能为空" }, { status: 400 })
    }

    const FAL_KEY = process.env.FAL_KEY
    if (!FAL_KEY) {
      return Response.json({ error: "请在环境变量中配置 FAL_KEY" }, { status: 500 })
    }

    // 1. 提交语音生成请求
    const submitResponse = await fetch("https://queue.fal.run/fal-ai/minimax/speech-02-turbo", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        voice_setting: {
          speed: 1.2,
          vol: 1.0,
          voice_id: "Wise_Woman",
          pitch: 0,
          english_normalization: false,
        },
        output_format: "url",
      }),
    })

    if (!submitResponse.ok) {
      throw new Error("提交语音生成请求失败")
    }

    const submitData = await submitResponse.json()
    const requestId = submitData.request_id

    // 2. 轮询状态直到完成
    let attempts = 0
    const maxAttempts = 30 // 最多等待30次，每次2秒，总共60秒

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 等待2秒

      const statusResponse = await fetch(`https://queue.fal.run/fal-ai/minimax/requests/${requestId}/status`, {
        headers: {
          Authorization: `Key ${FAL_KEY}`,
        },
      })

      if (!statusResponse.ok) {
        throw new Error("查询状态失败")
      }

      const statusData = await statusResponse.json()

      if (statusData.status === "COMPLETED") {
        // 3. 获取最终结果
        const resultResponse = await fetch(`https://queue.fal.run/fal-ai/minimax/requests/${requestId}`, {
          headers: {
            Authorization: `Key ${FAL_KEY}`,
          },
        })

        if (!resultResponse.ok) {
          throw new Error("获取结果失败")
        }

        const resultData = await resultResponse.json()

        return Response.json({
          audioUrl: resultData.audio.url,
          duration: resultData.duration_ms,
        })
      } else if (statusData.status === "FAILED") {
        throw new Error("语音生成失败")
      }

      attempts++
    }

    throw new Error("语音生成超时")
  } catch (error) {
    console.error("Text-to-speech error:", error)
    return Response.json({ error: "语音生成失败，请稍后重试" }, { status: 500 })
  }
}
