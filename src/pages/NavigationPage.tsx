import { useState, useMemo, useEffect } from 'react';
import { useNavStore } from '@/stores/navStore';
import { SearchBar } from '@/components/navigation/SearchBar';
import { SiteGroups } from '@/components/navigation/SiteGroups';
import { Toolbar } from '@/components/navigation/Toolbar';
import { Site } from '@/types';

export function NavigationPage() {
  const { sites, initialize, refreshSites } = useNavStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredSites = useMemo(() => {
    if (!searchTerm) {
      return sites;
    }

    const term = searchTerm.toLowerCase().trim();
    return sites.filter(site => {
      const name = site.name.toLowerCase();
      const url = site.url.toLowerCase();
      return name.includes(term) || url.includes(term);
    });
  }, [sites, searchTerm]);

  const handleSiteClick = (site: Site) => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  const handleRefresh = () => {
    refreshSites();
  };

  return (
    <div className="container">
      <div className="hero">
        <h1>我的导航</h1>
        <p>收藏常用网站，快速访问</p>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="panel">
        <div className="list-head">
          <h2>网站列表</h2>
          <Toolbar onRefresh={handleRefresh} />
        </div>
        <SiteGroups sites={filteredSites} searchTerm={searchTerm} onSiteClick={handleSiteClick} />
      </div>
    </div>
  );
}

export default NavigationPage;
