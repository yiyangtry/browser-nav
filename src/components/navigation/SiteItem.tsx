import { Site } from '@/types';
import { escapeHtml } from '@/utils/normalization';

interface SiteItemProps {
  site: Site;
  searchTerm: string;
  onClick: (site: Site) => void;
}

function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) {
    return escapeHtml(text);
  }

  const escapedText = escapeHtml(text);
  const escapedSearchTerm = escapeHtml(searchTerm);

  try {
    const regex = new RegExp(
      `(${escapedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  } catch {
    return escapedText;
  }
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
    <li
      className="site-item site-item-clickable"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      aria-label={`${site.name}，打开网站`}
    >
      <div className="site-main">
        <p
          className="site-name"
          dangerouslySetInnerHTML={{
            __html: highlightSearchTerm(site.name, searchTerm)
          }}
        />
        <p
          className="site-url"
          dangerouslySetInnerHTML={{
            __html: highlightSearchTerm(site.url, searchTerm)
          }}
        />
      </div>
    </li>
  );
}
