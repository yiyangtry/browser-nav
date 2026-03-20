interface ToolbarProps {
  onRefresh: () => void;
}

export function Toolbar({ onRefresh }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="ghost-btn" onClick={onRefresh}>
        刷新
      </button>
      <a href="/manage" className="ghost-btn link-btn">
        管理
      </a>
    </div>
  );
}
