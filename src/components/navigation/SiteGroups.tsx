import { Empty } from 'antd';
import { type Site } from '@/types';
import { SiteGroup } from './SiteGroup';

interface SiteGroupsProps {
  sites: Site[];
  searchTerm: string;
  onSiteClick: (site: Site) => void;
}

export function SiteGroups({ sites, searchTerm, onSiteClick }: SiteGroupsProps) {
  if (sites.length === 0) {
    if (searchTerm) {
      return <Empty className="empty-shell" description="未找到匹配的网站" />;
    }

    return <Empty className="empty-shell" description="还没有网址，请先去管理页添加。" />;
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
    <div className="site-groups-grid">
      {Array.from(groupedSites.entries()).map(([category, groupSites]) => (
        <SiteGroup
          key={category}
          category={category}
          sites={groupSites}
          searchTerm={searchTerm}
          onSiteClick={onSiteClick}
        />
      ))}
    </div>
  );
}
