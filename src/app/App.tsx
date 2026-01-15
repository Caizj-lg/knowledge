import { useMemo, useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { ToolCard, Tool } from './components/ToolCard';
import { AIAppCard, AIApp } from './components/AIAppCard';
import { AIChat } from './components/AIChat';
import { SubmitToolModal } from './components/SubmitToolModal';
// Mock data for tools
const TOOLS: Tool[] = [
  {
    id: '1',
    name: '大盘云图',
    url: 'https://dapanyuntu.com/',
    description: '大盘云图是一个股票大盘的网站，可以查看股票的大盘指数。',
    tags: ['股票', '大盘', '指数'],
  },
  {
    id: '2',
    name: 'codedex.io',
    url: 'https://www.codedex.io/courses',
    description: '玩游戏学编程的网站。',
    tags: ['编程', '游戏', '学习'],
  },
  {
    id: '3',
    name: '梦乡',
    url: 'http://yume.ly/',
    description: '这个网站可以看到别人分享的梦境。',
    tags: ['梦境', '猎奇'],
  },
  {
    id: '5',
    name: '象限图生成器',
    url: 'https://elysiatools.com/zh/tools/quadrant-chart',
    description: '企业级团队文档与知识库，适合规范化沉淀流程、产品/研发文档与权限管理。',
    tags: ['四象限图', '数据分析'],
  },
  {
    id: '6',
    name: '草料',
    url: 'https://cli.im/text/other',
    description: '草料二维码生成器，可以生成二维码。',
    tags: ['二维码', '生成'],
  },
  {
    id: '7',
    name: 'Canva',
    url: 'https://www.canva.com',
    description: 'Canva是一个在线设计工具，可以用来设计海报、名片、社交媒体图片等。',
    tags: ['设计', '海报', '社交媒体'],
  },
  {
    id: '8',
    name: 'lddgo.net',
    url: 'https://www.lddgo.net/index',
    description: '在线绘图工具，可以用来快捷绘制可视化图表。',
    tags: ['绘图', '图表', '可视化'],
  }
];

// Mock data for AI apps
const AI_APPS: AIApp[] = [
  {
    id: '1',
    name: 'Sora',
    url: 'https://sora.chatgpt.com/explore',
    description: 'AI生成视频的工具',
    scenarios: ['AI生成视频','设计'],
  },
  {
    id: '2',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: '通用型 AI 助手，支持问答、写作、总结与代码辅助。',
    scenarios: ['问答', '写作', '编程'],
  },
  {
    id: '3',
    name: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '高质量 AI 图像生成工具，适合创意设计与视觉探索。',
    scenarios: ['设计', '视觉', '创意'],
  },
  {
    id: '4',
    name: 'Github',
    url: 'https://github.com/',
    description: '代码托管平台，适合团队协作与代码管理。',
    scenarios: ['代码托管', '团队协作', '代码管理'],
  },
  {
    id: '5',
    name: 'manus',
    url: 'https://manus.im/app',
    description: 'manus是一个自动化处理的工具，可以帮你自动完成任务。',
    scenarios: ['自动化', '效率', '工作流'],
  },
];

const normalizeText = (value: string) => value.trim().toLowerCase();

const fuzzyMatch = (query: string, target: string) => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return true;
  }
  const normalizedTarget = normalizeText(target);
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  let queryIndex = 0;
  for (let i = 0; i < normalizedTarget.length; i += 1) {
    if (normalizedTarget[i] === normalizedQuery[queryIndex]) {
      queryIndex += 1;
    }
    if (queryIndex >= normalizedQuery.length) {
      return true;
    }
  }

  return false;
};

// 登录功能开关：设置为 false 时暂时禁用登录检查，但保留所有登录相关代码
const ENABLE_LOGIN = false;

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!ENABLE_LOGIN); // 如果禁用登录，默认设置为已登录
  const [username, setUsername] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (ENABLE_LOGIN) {
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
        setIsLoggedIn(true);
      }
    } else {
      // 如果禁用登录，自动设置为已登录状态
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
  };

  const filteredTools = useMemo(
    () => TOOLS.filter((tool) => fuzzyMatch(searchTerm, tool.name)),
    [searchTerm],
  );
  const filteredApps = useMemo(
    () => AI_APPS.filter((app) => fuzzyMatch(searchTerm, app.name)),
    [searchTerm],
  );

  // Show login page if not logged in (仅在启用登录时检查)
  if (ENABLE_LOGIN && !isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSearchSubmit={() => setSearchTerm(searchInput.trim())}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onLogout={handleLogout}
        username={username}
      />
      
      <div className="max-w-[1440px] mx-auto flex">
        {/* Main Content Area - 70% */}
        <main className="flex-1 w-[70%] p-6 space-y-12">
          {/* Tools Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">实用工具</h2>
              <p className="text-gray-600">常用网站与效率工具集合</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* AI Apps Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">AI 专区</h2>
              <p className="text-gray-600">可直接使用的 AI 应用与智能工具集合</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredApps.map((app) => (
                <AIAppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        </main>

        {/* AI Chat Sidebar - 30% */}
        <aside className="w-[30%] sticky top-[73px] h-[calc(100vh-73px)]">
          <AIChat />
        </aside>
      </div>

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        username={username}
      />
    </div>
  );
}
