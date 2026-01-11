import { ExternalLink, Star } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
}

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
          <Star className="w-5 h-5" />
        </button>
      </div>
      
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-1 group"
      >
        {tool.url}
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {tool.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          访问
        </a>
      </div>
    </div>
  );
}
