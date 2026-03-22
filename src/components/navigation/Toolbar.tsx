import { Link } from 'react-router-dom';

interface ToolbarProps {
  onRefresh: () => void;
}

export function Toolbar({ onRefresh }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="ghost-btn" onClick={onRefresh}>
        刷新
      </button>
      <Link to="/manage" className="ghost-btn link-btn">
        管理
      </Link>
    </div>
  );
}
