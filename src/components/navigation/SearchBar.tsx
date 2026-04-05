import { useEffect, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, type InputRef } from 'antd';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null;
      const isEditing =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.isContentEditable;

      if (event.key === '/' && !isEditing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Input
      ref={inputRef}
      size="large"
      allowClear
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="search-input"
      placeholder="搜索网站、链接或用途..."
      prefix={<SearchOutlined style={{ color: '#1768ac' }} />}
      suffix={<span className="search-shortcut">/</span>}
    />
  );
}
