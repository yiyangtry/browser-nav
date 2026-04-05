import { EditOutlined, HolderOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Select, Space, Typography } from 'antd';
import { type CSSProperties } from 'react';
import { type Site } from '@/types';
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

export function DraggableSiteCard({
  site,
  index,
  category,
  onEdit,
  onDelete,
}: DraggableSiteCardProps) {
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
    },
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-site-card ${isDragging ? 'is-dragging' : ''}`}
    >
      <Card className="site-admin-card" bordered={false} size="small">
        <div className="site-admin-card__content">
          <div className="site-admin-card__meta-wrap">
            <Button
              type="text"
              icon={<HolderOutlined />}
              className="drag-handle"
              aria-label={`拖动 ${site.name}`}
              {...attributes}
              {...listeners}
            />

            <div className="site-admin-card__meta">
              <Typography.Text strong>{site.name}</Typography.Text>
              <Typography.Text type="secondary" className="site-admin-card__url">
                {site.url}
              </Typography.Text>
              <Select
                size="small"
                value={site.category}
                options={groups.map((group) => ({ value: group, label: group }))}
                onChange={(value) => updateSiteCategory(index, value)}
                style={{ maxWidth: 220 }}
              />
            </div>
          </div>

          <Space wrap className="site-admin-card__actions">
            <Button icon={<EditOutlined />} onClick={() => onEdit(index)}>
              编辑
            </Button>
            <Button icon={<LinkOutlined />} href={site.url} target="_blank" rel="noopener noreferrer">
              打开
            </Button>
            <Popconfirm
              title={`确认删除网站“${site.name}”？`}
              okText="删除"
              cancelText="取消"
              onConfirm={() => onDelete(index)}
            >
              <Button danger>删除</Button>
            </Popconfirm>
          </Space>
        </div>
      </Card>
    </div>
  );
}
