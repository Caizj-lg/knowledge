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
    name: 'Notion',
    url: 'https://www.notion.so',
    description: '文档与知识库协作工具，适合团队沉淀资料与项目管理。',
    tags: ['知识库', '协作'],
  },
  {
    id: '2',
    name: 'Canva',
    url: 'https://www.canva.com',
    description: '快速制作海报、PPT 与社媒图片，适合非设计人员。',
    tags: ['设计', '效率'],
  },
  {
    id: '3',
    name: 'Excalidraw',
    url: 'https://excalidraw.com',
    description: '手绘风流程图与草图工具，适合快速梳理思路。',
    tags: ['流程图', '脑图'],
  },
  {
    id: '4',
    name: 'Regex101',
    url: 'https://regex101.com',
    description: '正则表达式在线调试与解释工具，开发必备。',
    tags: ['开发', '调试'],
  },
  {
    id: '5',
    name: '象限图生成器',
    url: 'https://elysiatools.com/zh/tools/quadrant-chart',
    description: '企业级团队文档与知识库，适合规范化沉淀流程、产品/研发文档与权限管理。',
    tags: ['四象限图', '数据分析'],
  },
];

// Mock data for AI apps
const AI_APPS: AIApp[] = [
  {
    id: '1',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    description: '带引用的 AI 搜索与问答工具，适合资料查询与快速研究。',
    scenarios: ['资料检索', '研究', '写作'],
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
    name: 'Zapier AI',
    url: 'https://zapier.com',
    description: '自动化工作流工具，结合 AI 实现多应用联动。',
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
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

  // Show login page if not logged in
  if (!isLoggedIn) {
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
