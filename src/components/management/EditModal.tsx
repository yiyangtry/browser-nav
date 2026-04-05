import { useEffect } from 'react';
import { App as AntApp, Form, Input, Modal, Select } from 'antd';
import { type Site } from '@/types';
import { useNavStore } from '@/stores/navStore';

interface EditModalProps {
  isOpen: boolean;
  site: Site | null;
  siteIndex: number | null;
  onClose: () => void;
}

interface EditFormValues {
  name: string;
  url: string;
  category: string;
}

export function EditModal({ isOpen, site, siteIndex, onClose }: EditModalProps) {
  const { message } = AntApp.useApp();
  const { groups, updateSite } = useNavStore();
  const [form] = Form.useForm<EditFormValues>();

  useEffect(() => {
    if (isOpen && site) {
      form.setFieldsValue({
        name: site.name,
        url: site.url,
        category: site.category,
      });
      return;
    }

    form.resetFields();
  }, [form, isOpen, site]);

  const handleFinish = ({ name, url, category }: EditFormValues) => {
    if (siteIndex === null || !site) {
      onClose();
      return;
    }

    const success = updateSite(siteIndex, {
      name: name.trim(),
      url: url.trim(),
      category,
    });

    if (success) {
      message.success('网站已更新。');
      onClose();
      return;
    }

    message.error('网址格式不正确，请检查后重试。');
  };

  return (
    <Modal
      open={isOpen}
      title="编辑网站"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <Form<EditFormValues> form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="网站名称"
          name="name"
          rules={[{ required: true, whitespace: true, message: '请输入网站名称。' }]}
        >
          <Input autoFocus />
        </Form.Item>

        <Form.Item
          label="网站地址"
          name="url"
          rules={[{ required: true, whitespace: true, message: '请输入网站地址。' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="分组"
          name="category"
          rules={[{ required: true, message: '请选择分组。' }]}
        >
          <Select options={groups.map((group) => ({ value: group, label: group }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
