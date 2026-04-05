import { useEffect, useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App as AntApp, Button, Form, Input, Modal, Popconfirm, Space, Tag, Typography } from 'antd';
import { useNavStore } from '@/stores/navStore';
import { DEFAULT_CATEGORY } from '@/types';

interface GroupFormValues {
  name: string;
}

export function GroupManager() {
  const { message, modal } = AntApp.useApp();
  const { groups, addGroup, renameGroup, deleteGroup } = useNavStore();
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [addForm] = Form.useForm<GroupFormValues>();
  const [renameForm] = Form.useForm<GroupFormValues>();

  useEffect(() => {
    if (renameTarget) {
      renameForm.setFieldsValue({ name: renameTarget });
    } else {
      renameForm.resetFields();
    }
  }, [renameForm, renameTarget]);

  const handleAddGroup = ({ name }: GroupFormValues) => {
    const success = addGroup(name.trim());

    if (!success) {
      message.error('分组已存在。');
      return;
    }

    addForm.resetFields();
    message.success('分组添加成功。');
  };

  const handleRenameSubmit = ({ name }: GroupFormValues) => {
    if (!renameTarget) {
      return;
    }

    const result = renameGroup(renameTarget, name.trim());

    if (result.success) {
      message.success('分组已改名。');
      setRenameTarget(null);
      return;
    }

    if (renameTarget === DEFAULT_CATEGORY && name.trim() !== DEFAULT_CATEGORY) {
      message.error('"未分组"不能改名。');
      return;
    }

    message.error(result.error || '改名失败。');
  };

  return (
    <>
      <Space direction="vertical" size={18} style={{ width: '100%' }}>
        <div>
          <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
            分组管理
          </Typography.Title>
          <Typography.Text type="secondary">
            新增、重命名或删除分组，删除后网站会自动移动到“未分组”。
          </Typography.Text>
        </div>

        <Form<GroupFormValues> form={addForm} layout="vertical" onFinish={handleAddGroup}>
          <div className="group-inline-form">
            <Form.Item
              name="name"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, whitespace: true, message: '请输入分组名。' }]}
            >
              <Input placeholder="新分组名" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
              添加
            </Button>
          </div>
        </Form>

        <div className="group-manager__list">
          {groups.map((group) => (
            <div key={group} className="group-manager__item">
              <Space
                align="center"
                style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}
              >
                <Space align="center" wrap>
                  <Typography.Text strong>{group}</Typography.Text>
                  {group === DEFAULT_CATEGORY ? (
                    <Tag color="default" bordered={false}>
                      固定分组
                    </Tag>
                  ) : null}
                </Space>

                <Space wrap>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      if (group === DEFAULT_CATEGORY) {
                        modal.info({
                          title: '固定分组不可改名',
                          content: '“未分组”是系统保留分组，不能重命名。',
                        });
                        return;
                      }
                      setRenameTarget(group);
                    }}
                  >
                    改名
                  </Button>

                  {group !== DEFAULT_CATEGORY ? (
                    <Popconfirm
                      title={`删除分组“${group}”？`}
                      description='该分组下的网站会移动到“未分组”。'
                      okText="删除"
                      cancelText="取消"
                      onConfirm={() => {
                        deleteGroup(group);
                        message.success(`已删除分组“${group}”，其网站已移到“未分组”。`);
                      }}
                    >
                      <Button danger>删除</Button>
                    </Popconfirm>
                  ) : null}
                </Space>
              </Space>
            </div>
          ))}
        </div>
      </Space>

      <Modal
        open={renameTarget !== null}
        title="重命名分组"
        onCancel={() => setRenameTarget(null)}
        onOk={() => renameForm.submit()}
        okText="保存"
        cancelText="取消"
      >
        <Form<GroupFormValues> form={renameForm} layout="vertical" onFinish={handleRenameSubmit}>
          <Form.Item
            label="分组名称"
            name="name"
            rules={[{ required: true, whitespace: true, message: '请输入新的分组名。' }]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
