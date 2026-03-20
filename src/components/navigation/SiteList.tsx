import { Site } from '@/types';
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
    <ul className="site-list">
      {sites.map((site, index) => (
        <SiteItem
          key={`${site.url}-${index}`}
          site={site}
          searchTerm={searchTerm}
          onClick={onSiteClick}
        />
      ))}
    </ul>
  );
}
