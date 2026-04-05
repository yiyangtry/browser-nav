import { Empty, Card, Space, Tag, Typography } from 'antd';
import { useNavStore } from '@/stores/navStore';
import { DraggableSiteCard } from './DraggableSiteCard';
import { type Site } from '@/types';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SiteManagerProps {
  onEditSite: (index: number) => void;
  onDeleteSite: (index: number) => void;
}

export function SiteManager({ onEditSite, onDeleteSite }: SiteManagerProps) {
  const { sites, reorderSites } = useNavStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (sites.length === 0) {
    return <Empty className="empty-shell" description="还没有网址，先添加一个吧。" />;
  }

  const groupedSites = new Map<string, Array<{ site: Site; index: number }>>();

  sites.forEach((site, index) => {
    const category = site.category || '未分组';
    if (!groupedSites.has(category)) {
      groupedSites.set(category, []);
    }
    groupedSites.get(category)!.push({ site, index });
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = parseInt(String(active.id).replace('site-', ''), 10);
    const overIndex = parseInt(String(over.id).replace('site-', ''), 10);

    const activeSite = sites[activeIndex];
    const overSite = sites[overIndex];

    if (activeSite && overSite && activeSite.category === overSite.category) {
      reorderSites(activeIndex, overIndex);
    }
  };

  return (
    <div className="site-manager__groups">
      {Array.from(groupedSites.entries()).map(([category, items]) => (
        <DndContext
          key={category}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Card
            className="site-manager-group-card"
            bordered={false}
            title={
              <Typography.Title level={4} style={{ margin: 0 }}>
                {category}
              </Typography.Title>
            }
            extra={<Tag bordered={false}>{items.length} 个</Tag>}
          >
            <SortableContext
              items={items.map(({ index }) => `site-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                {items.map(({ site, index }) => (
                  <DraggableSiteCard
                    key={`${site.url}-${index}`}
                    site={site}
                    index={index}
                    category={category}
                    onEdit={onEditSite}
                    onDelete={onDeleteSite}
                  />
                ))}
              </Space>
            </SortableContext>
          </Card>
        </DndContext>
      ))}
    </div>
  );
}
