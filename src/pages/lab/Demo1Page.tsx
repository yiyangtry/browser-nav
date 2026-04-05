import { BulbOutlined, ExperimentOutlined, RocketOutlined } from '@ant-design/icons';
import { Card, Flex, Space, Typography } from 'antd';

export default function Demo1Page() {
  return (
    <div className="page-shell">
      <Card className="page-hero" bordered={false}>
        <Space direction="vertical" size={12}>
          <span className="page-hero__eyebrow">Lab Preview</span>
          <Typography.Title level={1} className="page-hero__title">
            Demo 1
          </Typography.Title>
          <Typography.Text type="secondary" className="page-hero__description">
            这是实验区的占位页面，用来验证新的 Ant Design 外观在非核心页面也保持统一。
          </Typography.Text>
        </Space>
      </Card>

      <div className="demo-grid">
        {[
          {
            icon: <ExperimentOutlined style={{ fontSize: 24, color: '#1768ac' }} />,
            title: '实验容器',
            description: '后续新的页面原型、组件实验和交互验证都可以放在这里。',
          },
          {
            icon: <BulbOutlined style={{ fontSize: 24, color: '#1768ac' }} />,
            title: '视觉一致性',
            description: '与首页和管理页共享相同的壳层、字体、间距和面板语言。',
          },
          {
            icon: <RocketOutlined style={{ fontSize: 24, color: '#1768ac' }} />,
            title: '可持续扩展',
            description: '后续新增 Demo 时可以直接复用现有 AntD 主题和页面骨架。',
          },
        ].map((item) => (
          <Card key={item.title} className="dashboard-panel" bordered={false}>
            <Flex vertical gap={12}>
              {item.icon}
              <Typography.Title level={4} style={{ margin: 0 }}>
                {item.title}
              </Typography.Title>
              <Typography.Text type="secondary">{item.description}</Typography.Text>
            </Flex>
          </Card>
        ))}
      </div>
    </div>
  );
}
