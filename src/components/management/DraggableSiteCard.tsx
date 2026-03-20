import { Site } from '@/types';
import { useNavStore } from '@/stores/navStore';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableSiteCardProps {
  site: Site;
  index: number;
  category: string;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function DraggableSiteCard({ site, index, category, onEdit, onDelete }: DraggableSiteCardProps) {
  const { groups, updateSiteCategory } = useNavStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `site-${index}`,
    data: {
      index,
      category,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <li
      ref={setNodeRef}
      style={style}
      className={`site-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="site-main">
        <p className="site-name">{site.name}</p>
        <p className="site-url">{site.url}</p>
        <select
          className="inline-group-select"
          value={site.category}
          onChange={handleCategoryChange}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={() => onEdit(index)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          编辑
        </button>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseDown={(e) => e.stopPropagation()}
        >
          打开
        </a>
        <button
          type="button"
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
        >
          删除
        </button>
      </div>
    </li>
  );
}
