import { useState } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

type Category = 'tool' | 'ai-app';

export function SubmitToolModal({ isOpen, onClose, username }: SubmitToolModalProps) {
  const [category, setCategory] = useState<Category>('tool');
  const [toolName, setToolName] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<string[]>([]);
  const [scenarioInput, setScenarioInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddScenario = () => {
    if (scenarioInput.trim() && !scenarios.includes(scenarioInput.trim())) {
      setScenarios([...scenarios, scenarioInput.trim()]);
      setScenarioInput('');
    }
  };

  const handleRemoveScenario = (scenarioToRemove: string) => {
    setScenarios(scenarios.filter((scenario) => scenario !== scenarioToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submission = {
      id: Date.now().toString(),
      category,
      toolName,
      website,
      description,
      tags: category === 'tool' ? tags : [],
      scenarios: category === 'ai-app' ? scenarios : [],
      submitter: username,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage (mock submission)
    const existingSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    localStorage.setItem('submissions', JSON.stringify([...existingSubmissions, submission]));

    let notificationFailed = false;
    const githubOwner = import.meta.env.VITE_GITHUB_OWNER;
    const githubRepo = import.meta.env.VITE_GITHUB_REPO;
    const githubToken = import.meta.env.VITE_GITHUB_DISPATCH_TOKEN;
    if (githubOwner && githubRepo && githubToken) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${githubOwner}/${githubRepo}/dispatches`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${githubToken}`,
              'X-GitHub-Api-Version': '2022-11-28',
            },
            body: JSON.stringify({
              event_type: 'tool_submission',
              client_payload: submission,
            }),
          },
        );
        if (!response.ok) {
          notificationFailed = true;
        }
      } catch (error) {
        notificationFailed = true;
      }
    }

    // Show success message
    if (notificationFailed) {
      alert('提交成功！但消息通知失败，请稍后再试或联系管理员。');
    } else {
      alert('提交成功！感谢您的贡献，我们会尽快审核。');
    }

    // Reset form
    setCategory('tool');
    setToolName('');
    setWebsite('');
    setDescription('');
    setTags([]);
    setScenarios([]);
    setTagInput('');
    setScenarioInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">提交工具</h2>
            <p className="text-sm text-gray-600 mt-1">分享您喜欢的工具给社区</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择专区 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('tool')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  category === 'tool'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">实用工具</div>
                <div className="text-sm text-gray-600 mt-1">效率工具与网站</div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('ai-app')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  category === 'ai-app'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">AI 专区</div>
                <div className="text-sm text-gray-600 mt-1">AI 应用与智能工具</div>
              </button>
            </div>
          </div>

          {/* Submitter (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              提交者
            </label>
            <input
              type="text"
              value={username}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Tool Name */}
          <div>
            <label htmlFor="toolName" className="block text-sm font-medium text-gray-700 mb-2">
              工具名称 <span className="text-red-500">*</span>
            </label>
            <input
              id="toolName"
              type="text"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              placeholder="例如：Notion"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              网站链接 <span className="text-red-500">*</span>
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              工具说明 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简单描述这个工具的功能与适用场景..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Tags (for Tools) */}
          {category === 'tool' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签 <span className="text-gray-400">（可选）</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="输入标签后按回车添加"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500">可选填写，帮助更好分类</p>
              )}
            </div>
          )}

          {/* Scenarios (for AI Apps) */}
          {category === 'ai-app' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                适用场景 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddScenario())}
                  placeholder="输入适用场景后按回车添加"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddScenario}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              {scenarios.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {scenarios.map((scenario) => (
                    <span
                      key={scenario}
                      className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-full flex items-center gap-2"
                    >
                      {scenario}
                      <button
                        type="button"
                        onClick={() => handleRemoveScenario(scenario)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {scenarios.length === 0 && (
                <p className="text-sm text-gray-500">请至少添加一个适用场景</p>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={
                !toolName.trim() ||
                !website.trim() ||
                !description.trim() ||
                (category === 'ai-app' && scenarios.length === 0)
              }
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
