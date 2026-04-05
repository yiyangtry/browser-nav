import { Card, Tag, Typography } from 'antd';
import { type Site } from '@/types';
import { SiteList } from './SiteList';

interface SiteGroupProps {
  category: string;
  sites: Site[];
  searchTerm: string;
  onSiteClick: (site: Site) => void;
}

export function SiteGroup({ category, sites, searchTerm, onSiteClick }: SiteGroupProps) {
  return (
    <Card
      className="site-group-card"
      bordered={false}
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          {category}
        </Typography.Title>
      }
      extra={<Tag bordered={false}>{sites.length} 个</Tag>}
    >
      <SiteList sites={sites} searchTerm={searchTerm} onSiteClick={onSiteClick} />
    </Card>
  );
}
