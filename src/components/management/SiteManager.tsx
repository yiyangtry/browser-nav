import { useNavStore } from '@/stores/navStore';
import { DraggableSiteCard } from './DraggableSiteCard';
import { Site } from '@/types';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  DragEndEvent,
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
    return <p className="empty-state">还没有网址，先添加一个吧。</p>;
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

    if (over && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;

      // Extract indices from the IDs
      const activeIndex = parseInt(activeId.replace('site-', ''));
      const overIndex = parseInt(overId.replace('site-', ''));

      // Find the categories for both items
      const activeSite = sites[activeIndex];
      const overSite = sites[overIndex];

      // Only allow reordering within the same category
      if (activeSite && overSite && activeSite.category === overSite.category) {
        reorderSites(activeIndex, overIndex);
      }
    }
  };

  return (
    <div className="group-list">
      {Array.from(groupedSites.entries()).map(([category, items]) => (
        <DndContext
          key={category}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <section className="site-group">
            <div className="group-head">
              <h3 className="group-title">{category}</h3>
              <span className="group-count">{items.length} 个</span>
            </div>
            <SortableContext
              items={items.map(({ index }) => `site-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="site-list">
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
              </ul>
            </SortableContext>
          </section>
        </DndContext>
      ))}
    </div>
  );
}
