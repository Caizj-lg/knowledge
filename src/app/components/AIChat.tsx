import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: Array<{
    name: string;
    url: string;
    reason: string;
  }>;
}

const QUICK_TAGS = [
  '写文案',
  '做 PPT',
  '查资料（带引用）',
  '画流程图',
  'AI生成视频',
];

const EXAMPLE_QUESTIONS = [
  '我想找一个能做竞品分析并生成报告的工具',
  '帮我推荐适合团队协作的知识库工具',
  '有哪些 AI 工具可以帮助我提高写作效率？',
];

// Mock AI response generator
function generateAIResponse(userMessage: string): Message {
  const lowerMessage = userMessage.toLowerCase();
  const recommendations: Array<{ name: string; url: string; reason: string }> = [];

  // Simple keyword matching for recommendations
  if (lowerMessage.includes('资料') || lowerMessage.includes('查询') || lowerMessage.includes('搜索') || lowerMessage.includes('引用')) {
    recommendations.push({
      name: 'Perplexity',
      url: 'https://www.perplexity.ai',
      reason: '适合查资料并自动附带引用来源',
    });
  }

  if (lowerMessage.includes('知识库') || lowerMessage.includes('协作') || lowerMessage.includes('团队') || lowerMessage.includes('文档')) {
    recommendations.push({
      name: 'Notion',
      url: 'https://www.notion.so',
      reason: '适合搭建个人或团队知识库',
    });
  }

  if (lowerMessage.includes('写作') || lowerMessage.includes('文案') || lowerMessage.includes('ai') || lowerMessage.includes('问答') || lowerMessage.includes('竞品') || lowerMessage.includes('报告')) {
    recommendations.push({
      name: 'ChatGPT',
      url: 'https://chat.openai.com',
      reason: '适合需求拆解与方案生成',
    });
  }

  if (lowerMessage.includes('流程图') || lowerMessage.includes('图表') || lowerMessage.includes('画')) {
    recommendations.push({
      name: 'Excalidraw',
      url: 'https://excalidraw.com',
      reason: '适合快速绘制手绘风流程图',
    });
  }

  if (lowerMessage.includes('设计') || lowerMessage.includes('ppt') || lowerMessage.includes('海报')) {
    recommendations.push({
      name: 'Canva',
      url: 'https://www.canva.com',
      reason: '适合快速制作演示文稿与视觉设计',
    });
  }

  if (lowerMessage.includes('图片') || lowerMessage.includes('图像') || lowerMessage.includes('创意')) {
    recommendations.push({
      name: 'Midjourney',
      url: 'https://www.midjourney.com',
      reason: '适合 AI 图像生成与创意探索',
    });
  }

  if (lowerMessage.includes('自动化') || lowerMessage.includes('工作流')) {
    recommendations.push({
      name: 'Manus',
      url: 'https://manus.im/app',
      reason: 'manus是一个自动化工具流程。',
    });
  }

  // Default recommendations if no keywords matched
  if (recommendations.length === 0) {
    recommendations.push(
      {
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        reason: '通用型 AI 助手，适合各类问答与写作需求',
      },
      {
        name: 'Sora',
        url: 'https://sora.chatgpt.com/explore',
        reason: 'AI生成视频的工具',
      }
    );
  }

  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: '根据您的需求，我推荐以下工具：',
    recommendations,
  };
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickTag = (tag: string) => {
    setInput(tag);
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50 to-white border-l border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">AI 问答专区</h2>
        </div>
        <p className="text-sm text-gray-600">输入需求，AI 将推荐合适的工具与应用</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">点击下方问题快速开始：</div>
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.recommendations && (
                    <div className="mt-3 space-y-3">
                      {message.recommendations.map((rec, index) => (
                        <div key={index} className="border-t border-gray-200 pt-3 first:border-0 first:pt-0">
                          <div className="flex items-start gap-2">
                            <span className="text-purple-600 font-semibold text-sm flex-shrink-0">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm mb-1">
                                {rec.name}
                              </div>
                              <a
                                href={rec.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline block mb-1"
                              >
                                {rec.url}
                              </a>
                              <p className="text-xs text-gray-600">{rec.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600 italic">AI 正在思考中...</p>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Tags */}
      <div className="px-6 py-3 border-t border-gray-200 bg-white">
        <div className="text-xs text-gray-500 mb-2">快捷需求</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickTag(tag)}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="例如：我想找一个能做竞品分析并生成报告的工具"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
