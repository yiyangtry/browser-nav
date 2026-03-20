import { Site } from '@/types';
import { useNavStore } from '@/stores/navStore';

interface SiteCardProps {
  site: Site;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function SiteCard({ site, index, onEdit, onDelete }: SiteCardProps) {
  const { groups, updateSiteCategory } = useNavStore();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSiteCategory(index, e.target.value);
  };

  const handleDelete = () => {
    const confirmed = confirm(`确认删除网站"${site.name}"吗？`);
    if (confirmed) {
      onDelete(index);
    }
  };

  return (
    <li className="site-item">
      <div className="site-main">
        <p className="site-name">{site.name}</p>
        <p className="site-url">{site.url}</p>
        <select
          className="inline-group-select"
          value={site.category}
          onChange={handleCategoryChange}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button type="button" onClick={() => onEdit(index)}>
          编辑
        </button>
        <a href={site.url} target="_blank" rel="noopener noreferrer">
          打开
        </a>
        <button type="button" onClick={handleDelete}>
          删除
        </button>
      </div>
    </li>
  );
}
