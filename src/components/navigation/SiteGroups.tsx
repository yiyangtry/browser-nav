import { Site } from '@/types';
import { SiteGroup } from './SiteGroup';

interface SiteGroupsProps {
  sites: Site[];
  searchTerm: string;
  onSiteClick: (site: Site) => void;
}

export function SiteGroups({ sites, searchTerm, onSiteClick }: SiteGroupsProps) {
  if (sites.length === 0) {
    if (searchTerm) {
      return <p className="no-results">未找到匹配的网站</p>;
    }
    return <p className="empty-state">还没有网址，请先去管理页添加。</p>;
  }

  const groupedSites = new Map<string, Site[]>();

  sites.forEach((site) => {
    const category = site.category || '未分组';
    if (!groupedSites.has(category)) {
      groupedSites.set(category, []);
    }
    groupedSites.get(category)!.push(site);
  });

  return (
    <div className="group-list">
      {Array.from(groupedSites.entries()).map(([category, sites]) => (
        <SiteGroup
          key={category}
          category={category}
          sites={sites}
          searchTerm={searchTerm}
          onSiteClick={onSiteClick}
        />
      ))}
    </div>
  );
}
