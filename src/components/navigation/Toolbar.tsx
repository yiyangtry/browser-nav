import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ToolbarProps {
  onRefresh: () => void;
}

export function Toolbar({ onRefresh }: ToolbarProps) {
  const navigate = useNavigate();

  return (
    <Space wrap>
      <Button icon={<ReloadOutlined />} onClick={onRefresh}>
        刷新
      </Button>
      <Button type="primary" ghost icon={<SettingOutlined />} onClick={() => navigate('/manage')}>
        管理
      </Button>
    </Space>
  );
}
