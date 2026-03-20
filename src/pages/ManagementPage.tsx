import { useState, useEffect } from 'react';
import { useNavStore } from '@/stores/navStore';
import { SiteForm } from '@/components/management/SiteForm';
import { GroupManager } from '@/components/management/GroupManager';
import { SiteManager } from '@/components/management/SiteManager';
import { EditModal } from '@/components/management/EditModal';

export function ManagementPage() {
  const { sites, initialize, deleteSite, mergeDefaultSites } = useNavStore();
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleMessage = (text: string, isError = false) => {
    setMessage({ text, isError });
  };

  const handleEditSite = (index: number) => {
    setEditingIndex(index);
  };

  const handleDeleteSite = (index: number) => {
    deleteSite(index);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
  };

  const handleResetDefaults = () => {
    const confirmed = confirm('确认要恢复默认网站和分组吗？这将覆盖当前数据。');
    if (confirmed) {
      mergeDefaultSites();
      handleMessage('已恢复默认网站和分组。', false);
    }
  };

  const editingSite = editingIndex !== null ? sites[editingIndex] : null;

  return (
    <div className="container">
      <div className="hero">
        <h1>管理页面</h1>
        <p>添加、编辑和删除网站</p>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h2>添加网站</h2>
          <SiteForm onMessage={handleMessage} />

          <hr className="divider" />

          <GroupManager onMessage={handleMessage} />

          {message && (
            <p className="message" style={{ color: message.isError ? '#ff8d8d' : '#a6b0c3' }}>
              {message.text}
            </p>
          )}

          <button className="ghost-btn" onClick={handleResetDefaults} style={{ marginTop: '16px' }}>
            恢复默认
          </button>
        </div>

        <div className="panel">
          <div className="list-head">
            <h2>网站列表</h2>
            <a href="/" className="ghost-btn link-btn">
              返回导航
            </a>
          </div>
          <SiteManager
            onEditSite={handleEditSite}
            onDeleteSite={handleDeleteSite}
          />
        </div>
      </div>

      <EditModal
        isOpen={editingIndex !== null}
        site={editingSite}
        siteIndex={editingIndex}
        onClose={handleCloseModal}
        onMessage={handleMessage}
      />
    </div>
  );
}

export default ManagementPage;
