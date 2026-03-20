import { useState, useEffect } from 'react';
import { Site } from '@/types';
import { useNavStore } from '@/stores/navStore';

interface EditModalProps {
  isOpen: boolean;
  site: Site | null;
  siteIndex: number | null;
  onClose: () => void;
  onMessage: (message: string, isError?: boolean) => void;
}

export function EditModal({ isOpen, site, siteIndex, onClose, onMessage }: EditModalProps) {
  const { groups, updateSite } = useNavStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (site) {
      setName(site.name);
      setUrl(site.url);
      setCategory(site.category);
    }
  }, [site]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (siteIndex === null || !site) {
      onClose();
      return;
    }

    if (!name.trim() || !url.trim()) {
      onMessage('请填写完整名称和网址。', true);
      return;
    }

    const success = updateSite(siteIndex, {
      name: name.trim(),
      url: url.trim(),
      category
    });

    if (success) {
      onMessage('网站已更新。', false);
      onClose();
    } else {
      onMessage('网址格式不正确，请检查后重试。', true);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !site) {
    return null;
  }

  return (
    <div className="modal" aria-hidden="false">
      <div className="modal-backdrop" data-close-modal onClick={handleBackdropClick} />
      <div className="modal-panel">
        <h2>编辑网站</h2>
        <form onSubmit={handleSubmit}>
          <div className="site-form">
            <label>
              网站名称
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>

            <label>
              网站地址
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>

            <label>
              分组
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-actions">
              <button type="submit">保存</button>
              <button type="button" className="ghost-btn" onClick={onClose}>
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
