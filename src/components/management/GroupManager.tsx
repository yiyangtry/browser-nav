import { useState, FormEvent } from 'react';
import { useNavStore } from '@/stores/navStore';
import { DEFAULT_CATEGORY } from '@/types';

interface GroupManagerProps {
  onMessage: (message: string, isError?: boolean) => void;
}

export function GroupManager({ onMessage }: GroupManagerProps) {
  const { groups, addGroup, renameGroup, deleteGroup } = useNavStore();
  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = (e: FormEvent) => {
    e.preventDefault();

    if (!newGroupName.trim()) {
      onMessage('分组名不能为空。', true);
      return;
    }

    const success = addGroup(newGroupName.trim());

    if (success) {
      setNewGroupName('');
      onMessage('分组添加成功。', false);
    } else {
      onMessage('分组已存在。', true);
    }
  };

  const handleRenameGroup = (oldName: string) => {
    const next = prompt('请输入新分组名', oldName);
    if (!next) return;

    const result = renameGroup(oldName, next);

    if (result.success) {
      onMessage('分组已改名。', false);
    } else {
      if (oldName === DEFAULT_CATEGORY && next !== DEFAULT_CATEGORY) {
        onMessage('"未分组"不能改名。', true);
      } else {
        onMessage(result.error || '改名失败。', true);
      }
    }
  };

  const handleDeleteGroup = (name: string) => {
    if (name === DEFAULT_CATEGORY) {
      onMessage('"未分组"不能删除。', true);
      return;
    }

    const confirmed = confirm(`确认删除分组"${name}"吗？该分组网站会移动到"未分组"。`);
    if (!confirmed) return;

    deleteGroup(name);
    onMessage(`已删除分组"${name}"，其网站已移到"未分组"。`, false);
  };

  return (
    <div>
      <h2>分组管理</h2>

      <form className="group-form" onSubmit={handleAddGroup}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="新分组名"
        />
        <button type="submit">添加</button>
      </form>

      <div className="group-manage-list">
        {groups.map((group) => (
          <div key={group} className="group-manage-item">
            <span className="group-manage-name">{group}</span>
            <div className="group-manage-actions">
              <button
                type="button"
                className="ghost-btn mini-btn"
                onClick={() => handleRenameGroup(group)}
              >
                改名
              </button>
              {group !== DEFAULT_CATEGORY && (
                <button
                  type="button"
                  className="mini-delete-btn"
                  onClick={() => handleDeleteGroup(group)}
                >
                  删除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
