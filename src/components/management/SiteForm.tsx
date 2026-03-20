import { useState, FormEvent } from 'react';
import { useNavStore } from '@/stores/navStore';

interface SiteFormProps {
  onMessage: (message: string, isError?: boolean) => void;
}

export function SiteForm({ onMessage }: SiteFormProps) {
  const { groups, addSite } = useNavStore();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(() => groups.includes('AI 工具') ? 'AI 工具' : groups[0] || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      onMessage('请填写完整名称和网址。', true);
      return;
    }

    const success = addSite({ name: name.trim(), url: url.trim(), category });

    if (success) {
      setName('');
      setUrl('');
      setCategory(groups.includes('AI 工具') ? 'AI 工具' : groups[0] || '');
      onMessage('添加成功。', false);
    } else {
      onMessage('网址格式不正确，请检查后重试。', true);
    }
  };

  return (
    <form className="site-form" onSubmit={handleSubmit}>
      <label>
        网站名称
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如: Google"
        />
      </label>

      <label>
        网站地址
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="例如: google.com"
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

      <button type="submit">添加网站</button>
    </form>
  );
}
