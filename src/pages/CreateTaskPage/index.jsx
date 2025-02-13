// CreateTaskPage.jsx
import React, { useState } from "react";
import { Form, Input, Select, Button, Card, message } from "antd";
import {
  UserOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { TextArea } = Input;
const { Option } = Select;

const CreateTaskPage = ({
  teamMembers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ],
  onSubmit = async (values) => {
    console.log("Task values:", values);
    return Promise.resolve(values);
  },
  onBack = () => window.history.back(),
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Convert team member for display
  const getTeamMemberName = (memberId) => {
    const member = teamMembers.find((m) => m.id === memberId);
    return member ? member.name : "Unassigned";
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Add timestamp and default values
      const taskData = {
        ...values,
        assigneeName: getTeamMemberName(values.assignee), // Add assignee name
        created_at: new Date().toISOString(),
        id: `task-${Date.now()}`,
      };

      await onSubmit(taskData);
      message.success("Task created successfully!");
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        message.error("Please check all required fields");
      } else {
        message.error("Failed to create task. Please try again.");
        console.error("Task creation failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-container">
      <div className="page-header">
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="back-button"
        >
          Back to Tasks
        </Button>
        <h1>Create New Task</h1>
      </div>

      <Card className="task-form-card">
        <Form
          form={form}
          layout="vertical"
          className="task-form"
          initialValues={{
            status: "Todo",
            priority: "Medium",
            assignee: "unassigned",
          }}
        >
          <div className="form-grid">
            <div className="main-fields">
              <Form.Item
                name="title"
                label="Task Title"
                rules={[
                  { required: true, message: "Please enter a task title" },
                  {
                    max: 100,
                    message: "Title cannot be longer than 100 characters",
                  },
                  { min: 3, message: "Title must be at least 3 characters" },
                ]}
              >
                <Input
                  placeholder="Enter a descriptive title"
                  className="custom-input"
                  maxLength={100}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter a task description",
                  },
                  {
                    min: 10,
                    message: "Description must be at least 10 characters",
                  },
                ]}
              >
                <TextArea
                  placeholder="Provide detailed information about the task"
                  rows={6}
                  className="custom-textarea"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </div>

            <div className="side-fields">
              <Card className="settings-card">
                <h3>Task Settings</h3>

                <Form.Item
                  name="assignee"
                  label="Assignee"
                  rules={[
                    { required: true, message: "Please select an assignee" },
                  ]}
                >
                  <Select
                    placeholder="Select team member"
                    className="custom-select"
                    suffixIcon={<UserOutlined />}
                  >
                    <Option value="unassigned">
                      <div className="select-option">
                        <UserOutlined className="option-icon unassigned" />
                        <span>Unassigned (Shared Task)</span>
                      </div>
                    </Option>
                    {teamMembers.map((member) => (
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
                  rules={[
                    { required: true, message: "Please select a status" },
                  ]}
                >
                  <Select
                    className="custom-select"
                    suffixIcon={<CheckCircleOutlined />}
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
                  rules={[
                    { required: true, message: "Please select a priority" },
                  ]}
                >
                  <Select
                    className="custom-select"
                    suffixIcon={<FlagOutlined />}
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
              </Card>

              <div className="action-buttons">
                <Button onClick={() => form.resetFields()}>Reset</Button>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
