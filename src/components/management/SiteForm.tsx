import { useEffect, useMemo } from 'react';
import { App as AntApp, Button, Form, Input, Select, Space } from 'antd';
import { useNavStore } from '@/stores/navStore';

interface SiteFormValues {
  name: string;
  url: string;
  category: string;
}

export function SiteForm() {
  const { message } = AntApp.useApp();
  const { groups, addSite } = useNavStore();
  const [form] = Form.useForm<SiteFormValues>();

  const defaultCategory = useMemo(
    () => (groups.includes('AI 工具') ? 'AI 工具' : groups[0] || ''),
    [groups]
  );

  useEffect(() => {
    const currentCategory = form.getFieldValue('category');
    if (!currentCategory || !groups.includes(currentCategory)) {
      form.setFieldValue('category', defaultCategory);
    }
  }, [defaultCategory, form, groups]);

  const handleFinish = ({ name, url, category }: SiteFormValues) => {
    const success = addSite({ name: name.trim(), url: url.trim(), category });

    if (success) {
      form.resetFields();
      form.setFieldValue('category', defaultCategory);
      message.success('添加成功。');
      return;
    }

    message.error('网址格式不正确，请检查后重试。');
  };

  return (
    <Form<SiteFormValues>
      form={form}
      layout="vertical"
      initialValues={{ category: defaultCategory }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="网站名称"
        name="name"
        rules={[{ required: true, whitespace: true, message: '请输入网站名称。' }]}
      >
        <Input placeholder="例如：Google" size="large" />
      </Form.Item>

      <Form.Item
        label="网站地址"
        name="url"
        rules={[{ required: true, whitespace: true, message: '请输入网站地址。' }]}
      >
        <Input placeholder="例如：google.com" size="large" />
      </Form.Item>

      <Form.Item
        label="分组"
        name="category"
        rules={[{ required: true, message: '请选择分组。' }]}
      >
        <Select
          size="large"
          options={groups.map((group) => ({ value: group, label: group }))}
        />
      </Form.Item>

      <Space>
        <Button type="primary" htmlType="submit">
          添加网站
        </Button>
        <Button
          onClick={() => {
            form.resetFields();
            form.setFieldValue('category', defaultCategory);
          }}
        >
          重置
        </Button>
      </Space>
    </Form>
  );
}
