import { List } from 'antd';
import { type Site } from '@/types';
import { SiteItem } from './SiteItem';

interface SiteListProps {
  sites: Site[];
  searchTerm: string;
  onSiteClick: (site: Site) => void;
}

export function SiteList({ sites, searchTerm, onSiteClick }: SiteListProps) {
  if (sites.length === 0) {
    return null;
  }

  return (
    <List
      className="site-list"
      split={false}
      dataSource={sites}
      renderItem={(site, index) => (
        <SiteItem
          key={`${site.url}-${index}`}
          site={site}
          searchTerm={searchTerm}
          onClick={onSiteClick}
        />
      )}
    />
  );
}
