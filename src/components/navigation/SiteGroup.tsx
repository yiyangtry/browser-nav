import { Site } from '@/types';
import { SiteList } from './SiteList';

interface SiteGroupProps {
  category: string;
  sites: Site[];
  searchTerm: string;
  onSiteClick: (site: Site) => void;
}

export function SiteGroup({ category, sites, searchTerm, onSiteClick }: SiteGroupProps) {
  return (
    <section className="site-group">
      <div className="group-head">
        <h3 className="group-title">{category}</h3>
        <span className="group-count">{sites.length} 个</span>
      </div>
      <SiteList sites={sites} searchTerm={searchTerm} onSiteClick={onSiteClick} />
    </section>
  );
}
