import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Space, Button, Avatar } from 'antd';
import { UserOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';

const TaskModal = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={
        <Form.Item
          name="taskName"
          style={{ margin: 0 }}
        >
          <Input 
            placeholder="Write a task name" 
            bordered={false}
            style={{ fontSize: '20px', padding: 0 }}
          />
        </Form.Item>
      }
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <div style={{ marginBottom: 24 }}>
          <Space size={40}>
            <div>
              <div className="text-gray-500 text-sm mb-1">ASSIGNED TO</div>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <span>No assignee</span>
              </Space>
            </div>

            <div>
              <div className="text-gray-500 text-sm mb-1">CREATED</div>
              <Space>
                <CalendarOutlined />
                <span>Nov 29, 2021</span>
              </Space>
            </div>

            <div>
              <div className="text-gray-500 text-sm mb-1">LABELS</div>
              <Select
                defaultValue="development"
                style={{ width: 120 }}
                options={[
                  { value: 'development', label: 'Development' }
                ]}
              />
            </div>

            <div>
              <div className="text-gray-500 text-sm mb-1">DUE DATE</div>
              <Space>
                <CalendarOutlined />
                <span>No due date</span>
              </Space>
            </div>
          </Space>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="text-gray-800 font-medium mb-2">Description</div>
          <Input.TextArea 
            placeholder="Add more details to this task..."
            bordered={false}
            style={{ backgroundColor: '#f5f5f5', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div className="text-gray-800 font-medium mb-2">Subtask</div>
          <Button type="text" icon={<PlusOutlined />}>
            Add
          </Button>
        </div>

        <div>
          <div className="text-gray-800 font-medium mb-2">Activity</div>
          <Space>
            <Avatar src="https://via.placeholder.com/32" />
            <Input.TextArea 
              placeholder="Add a comment..."
              bordered={false}
              style={{ backgroundColor: '#f5f5f5', padding: '8px' }}
            />
          </Space>
          <div className="text-gray-400 text-sm mt-2">
            Pro tip: press M to comment
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskModal;