"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles, Copy, RefreshCw, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!input.trim()) {
      toast({
        title: "请输入内容",
        description: "请先输入需要转换的普通话内容",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error("转换失败")
      }

      const data = await response.json()
      setOutput(data.output)
      setAudioUrl("") // 清除之前的音频
    } catch (error) {
      toast({
        title: "转换失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateAudio = async () => {
    if (!output) {
      toast({
        title: "没有内容",
        description: "请先生成黑话内容",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingAudio(true)
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: output }),
      })

      if (!response.ok) {
        throw new Error("语音生成失败")
      }

      const data = await response.json()
      setAudioUrl(data.audioUrl)

      toast({
        title: "语音生成成功",
        description: "点击播放按钮收听黑话语音",
      })
    } catch (error) {
      toast({
        title: "语音生成失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const handlePlayAudio = () => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)

      audio.onended = () => {
        setIsPlaying(false)
      }

      audio.onerror = () => {
        setIsPlaying(false)
        toast({
          title: "播放失败",
          description: "音频播放出现问题",
          variant: "destructive",
        })
      }
    }
  }

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      toast({
        title: "复制成功",
        description: "黑话内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制内容",
        variant: "destructive",
      })
    }
  }

  const examples = [
    {
      input: "我想做个群，发红包让大家活跃一下",
      output:
        "我的思路是将用户聚集在私域阵地，寻找用户痛点，抓住用户爽点，通过战略性亏损，扭转用户心智，从而达成价值转化",
    },
    {
      input: "我们要多发朋友圈宣传产品",
      output: "我们需要通过社交媒体矩阵进行品牌曝光，利用内容营销策略，在用户心智中建立品牌认知，实现流量变现的闭环",
    },
    {
      input: "这个功能用户很喜欢",
      output: "这个功能在用户体验层面实现了突破性创新，获得了用户的强烈共鸣，形成了良好的产品口碑传播效应",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              互联网黑话生成器
            </h1>
          </div>
          <p className="text-gray-600 text-lg">将普通话瞬间转换成高大上的互联网黑话，还能用语音念出来！</p>
        </div>

        {/* Main Tool */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Input */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                普通话输入
              </CardTitle>
              <CardDescription>输入你想要表达的内容，越简单越好</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="例如：我想做个群，发红包让大家活跃一下..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] resize-none border-gray-200 focus:border-purple-400 focus:ring-purple-400"
              />
              <Button
                onClick={handleTranslate}
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    转换成黑话
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                互联网黑话输出
              </CardTitle>
              <CardDescription>高大上的专业表达，让你瞬间变身行业专家</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[120px] p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                {output ? (
                  <p className="text-gray-800 leading-relaxed">{output}</p>
                ) : (
                  <p className="text-gray-400 italic">转换后的黑话将在这里显示...</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleCopy}
                  disabled={!output}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  复制黑话
                </Button>
                <Button
                  onClick={handleGenerateAudio}
                  disabled={!output || isGeneratingAudio}
                  variant="outline"
                  className="flex-1 border-purple-300 hover:bg-purple-50 text-purple-600"
                >
                  {isGeneratingAudio ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      生成语音
                    </>
                  )}
                </Button>
              </div>
              {audioUrl && (
                <Button
                  onClick={handlePlayAudio}
                  className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4" />
                      停止播放
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      播放语音
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">转换示例</CardTitle>
            <CardDescription>看看普通话是如何华丽转身的</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200"
                >
                  <div className="mb-2">
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">普通话</span>
                    <p className="mt-2 text-gray-700">{example.input}</p>
                  </div>
                  <div className="flex items-center gap-2 my-2">
                    <ArrowRight className="h-4 w-4 text-purple-500" />
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-blue-200"></div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">互联网黑话</span>
                    <p className="mt-2 text-gray-700 font-medium">{example.output}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>让每一句话都充满专业感，还能用语音念出来 ✨🔊</p>
        </div>
      </div>
    </div>
  )
}
