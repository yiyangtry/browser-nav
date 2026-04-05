import { useEffect, useState, type ReactNode } from 'react';
import { DatabaseOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Card, Divider, Flex, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useNavStore } from '@/stores/navStore';
import { SiteForm } from '@/components/management/SiteForm';
import { GroupManager } from '@/components/management/GroupManager';
import { SiteManager } from '@/components/management/SiteManager';
import { EditModal } from '@/components/management/EditModal';

export function ManagementPage() {
  const navigate = useNavigate();
  const { message, modal } = AntApp.useApp();
  const { sites, initialize, deleteSite, mergeDefaultSites } = useNavStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleResetDefaults = () => {
    modal.confirm({
      title: '恢复默认网站和分组',
      content: '这会合并回默认站点，保留现有不重复条目。',
      okText: '恢复',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        mergeDefaultSites();
        message.success('已恢复默认网站和分组。');
      },
    });
  };

  const editingSite = editingIndex !== null ? sites[editingIndex] : null;

  return (
    <div className="page-shell">
      <Card className="page-hero" bordered={false}>
        <Flex vertical gap={24}>
          <Flex justify="space-between" align="flex-start" gap={24} wrap="wrap">
            <Space direction="vertical" size={10}>
              <span className="page-hero__eyebrow">Management Studio</span>
              <Typography.Title level={1} className="page-hero__title">
                管理页面
              </Typography.Title>
              <Typography.Text type="secondary" className="page-hero__description">
                维护收藏站点、调整分组、重排展示顺序，并通过统一的 Ant Design 表单完成编辑。
              </Typography.Text>
            </Space>

            <div className="page-hero__stats">
              <StatChip icon={<DatabaseOutlined />} label="站点总数" value={sites.length} />
              <StatChip icon={<EditOutlined />} label="编辑状态" value={editingIndex === null ? '空闲' : '进行中'} />
              <StatChip icon={<ReloadOutlined />} label="恢复默认" value="可用" />
            </div>
          </Flex>
        </Flex>
      </Card>

      <div className="management-grid">
        <Card className="dashboard-panel" bordered={false}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Typography.Title level={3} style={{ marginTop: 0 }}>
                添加网站
              </Typography.Title>
              <Typography.Text type="secondary">
                新站点会经过现有 store 的归一化逻辑并同步到本地存储。
              </Typography.Text>
            </div>

            <SiteForm />

            <Divider style={{ margin: 0 }} />

            <GroupManager />

            <Button danger ghost onClick={handleResetDefaults}>
              恢复默认
            </Button>
          </Space>
        </Card>

        <Card className="dashboard-panel" bordered={false}>
          <Flex justify="space-between" align="center" gap={16} wrap="wrap" style={{ marginBottom: 20 }}>
            <Space direction="vertical" size={2}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                网站列表
              </Typography.Title>
              <Typography.Text type="secondary">
                在组内拖拽排序，或直接修改分组与链接。
              </Typography.Text>
            </Space>

            <Button type="primary" ghost onClick={() => navigate('/')}>
              返回导航
            </Button>
          </Flex>

          <SiteManager onEditSite={setEditingIndex} onDeleteSite={deleteSite} />
        </Card>
      </div>

      <EditModal
        isOpen={editingIndex !== null}
        site={editingSite}
        siteIndex={editingIndex}
        onClose={() => setEditingIndex(null)}
      />
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="page-stat-chip">
      <div style={{ fontSize: 20, color: '#1768ac' }}>{icon}</div>
      <div>
        <span className="page-stat-chip__label">{label}</span>
        <span className="page-stat-chip__value">{value}</span>
      </div>
    </div>
  );
}

export default ManagementPage;
