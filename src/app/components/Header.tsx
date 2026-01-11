import { Search, Plus, Info, User } from 'lucide-react';

type HeaderProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSubmitClick: () => void;
  onLogout: () => void;
  username: string;
};

export function Header(props: HeaderProps) {
  const { searchValue, onSearchChange, onSearchSubmit, onSubmitClick } = props;
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
          <h1 className="text-xl font-semibold text-gray-900">Knowledge Hub</h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索工具 / AI 应用"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onSearchSubmit();
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSubmitClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            提交工具
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Info className="w-4 h-4" />
            关于
          </button>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
