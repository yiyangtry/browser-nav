import type { ReactNode } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { List, Typography } from 'antd';
import { type Site } from '@/types';

interface SiteItemProps {
  site: Site;
  searchTerm: string;
  onClick: (site: Site) => void;
}

function highlightSearchTerm(text: string, searchTerm: string): ReactNode {
  const normalizedTerm = searchTerm.trim();

  if (!normalizedTerm) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(normalizedTerm)})`, 'ig');

  return text.split(regex).map((part, index) =>
    part.toLowerCase() === normalizedTerm.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="search-mark">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function SiteItem({ site, searchTerm, onClick }: SiteItemProps) {
  const handleClick = () => {
    onClick(site);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(site);
    }
  };

  return (
    <List.Item>
      <div
        className="site-item-card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="link"
        aria-label={`${site.name}，打开网站`}
      >
        <div className="site-item-card__meta">
          <Typography.Text strong className="site-item-card__title">
            {highlightSearchTerm(site.name, searchTerm)}
          </Typography.Text>
          <Typography.Text type="secondary" className="site-item-card__url">
            {highlightSearchTerm(site.url, searchTerm)}
          </Typography.Text>
        </div>
        <ArrowRightOutlined style={{ color: '#1768ac', fontSize: 18 }} />
      </div>
    </List.Item>
  );
}
