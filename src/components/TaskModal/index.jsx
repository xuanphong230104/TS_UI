// TaskModal.jsx
import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, UserOutlined, FlagOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './index.scss';

const { TextArea } = Input;
const { Option } = Select;

const TaskCreationModal = ({ visible, onCancel, onSubmit, teamMembers = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit(values);
      message.success('Task created successfully!');
      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="modal-title">
          <span className="title-icon">
            <PlusOutlined />
          </span>
          Create New Task
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Create Task"
      width={600}
      className="custom-task-modal"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="task-form"
        initialValues={{
          status: 'Todo',
          priority: 'Medium'
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a task title' }]}
        >
          <Input 
            placeholder="Enter a descriptive title"
            className="custom-input"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a task description' }]}
        >
          <TextArea
            placeholder="Provide detailed information about the task"
            rows={4}
            className="custom-textarea"
          />
        </Form.Item>

        <div className="form-grid">
          <Form.Item
            name="assignee"
            label="Assignee"
            rules={[{ required: true, message: 'Please select an assignee' }]}
          >
            <Select
              placeholder="Select team member"
              className="custom-select"
              suffixIcon={<UserOutlined className="select-icon" />}
            >
              <Option value="unassigned">
                <div className="select-option">
                  <UserOutlined className="option-icon unassigned" />
                  <span>Unassigned (Shared Task)</span>
                </div>
              </Option>
              {teamMembers.map(member => (
                <Option key={member.id} value={member.id}>
                  <div className="select-option">
                    <UserOutlined className="option-icon" />
                    <span>{member.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
          >
            <Select
              className="custom-select"
              suffixIcon={<CheckCircleOutlined className="select-icon" />}
            >
              <Option value="Todo">
                <div className="select-option">
                  <span className="status-dot todo"></span>
                  Todo
                </div>
              </Option>
              <Option value="In Progress">
                <div className="select-option">
                  <span className="status-dot in-progress"></span>
                  In Progress
                </div>
              </Option>
              <Option value="Done">
                <div className="select-option">
                  <span className="status-dot done"></span>
                  Done
                </div>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            className="priority-field"
          >
            <Select
              className="custom-select"
              suffixIcon={<FlagOutlined className="select-icon" />}
            >
              <Option value="Low">
                <div className="select-option">
                  <span className="priority-dot low"></span>
                  Low Priority
                </div>
              </Option>
              <Option value="Medium">
                <div className="select-option">
                  <span className="priority-dot medium"></span>
                  Medium Priority
                </div>
              </Option>
              <Option value="High">
                <div className="select-option">
                  <span className="priority-dot high"></span>
                  High Priority
                </div>
              </Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskCreationModal;