import { ExternalLink, Sparkles } from 'lucide-react';

export interface AIApp {
  id: string;
  name: string;
  url: string;
  description: string;
  scenarios: string[];
}

interface AIAppCardProps {
  app: AIApp;
}

export function AIAppCard({ app }: AIAppCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{app.name}</h3>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
          >
            {app.url}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">
        {app.description}
      </p>
      
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">适用场景</div>
        <div className="flex flex-wrap gap-2">
          {app.scenarios.map((scenario) => (
            <span
              key={scenario}
              className="px-2.5 py-1 bg-white/80 text-purple-700 text-xs rounded-full border border-purple-200"
            >
              {scenario}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm text-center rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
        >
          打开应用
        </a>
      </div>
    </div>
  );
}
