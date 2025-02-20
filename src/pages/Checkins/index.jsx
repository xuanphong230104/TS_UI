import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Input,
  Button,
  List,
  Tag,
  Typography,
  Space,
  Divider,
  message,
  Form,
} from "antd";
import {
  PlusOutlined,
  CheckOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CheckInForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Fetch teams data
  // useEffect(() => {
  //   const fetchTeams = async () => {
  //     try {
  //       // Replace with your API endpoint
  //       const response = await fetch("/api/teams");
  //       const data = await response.json();
  //       setTeams(data);
  //     } catch (error) {
  //       message.error("Failed to fetch teams");
  //     }
  //   };

  //   fetchTeams();
  // }, []);

  // Fetch team tasks when team is selected
  const fetchTeamTasks = async (teamId) => {
    try {
      // Replace with your API endpoint
      const response = await fetch(`/api/teams/${teamId}/tasks`);
      const data = await response.json();
      setTeamTasks(data);
    } catch (error) {
      message.error("Failed to fetch team tasks");
    }
  };

  // const handleTeamChange = (teamId) => {
  //   form.setFieldsValue({ tasks: [] });
  //   setSelectedTasks([]);
  //   fetchTeamTasks(teamId);
  // };

  const handleAddPersonalTask = () => {
    const taskValue = form.getFieldValue("newTask");
    if (taskValue?.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskValue,
        status: "Todo",
      };
      setSelectedTasks([...selectedTasks, newTask]);
      form.setFieldsValue({ newTask: "" });
    }
    form.resetFields(["newTask"]);
  };

  const handleTeamTaskSelect = (taskId) => {
    const task = teamTasks.find((t) => t.id === taskId);
    if (task && !selectedTasks.find((t) => t.id === task.id)) {
      const newTask = {
        ...task,
        status: "Todo",
      };
      setSelectedTasks([...selectedTasks, newTask]);
    }
  };

  const handleSubmit = async (values) => {
    if (selectedTasks.length === 0) {
      message.error("Please add at least one task");
      return;
    }

    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: values.teamId,
          content: values.content,
          tasks: selectedTasks,
          checkInTime: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit check-in");
      }

      message.success("Check-in submitted successfully!");
      form.resetFields();
      setSelectedTasks([]);
    } catch (error) {
      message.error("Failed to submit check-in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-in-container">
      <Card className="check-in-card">
        <Title level={2} className="page-title">
          <ClockCircleOutlined /> Daily Check-in
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ tasks: [] }}
        >
          <div className="section">
            <Form.Item
              name="content"
              label={<Text strong>1. Check-in Content</Text>}
              rules={[
                { required: true, message: "Please enter check-in content" },
              ]}
            >
              <TextArea
                placeholder="What are your plans for today?"
                rows={4}
                className="content-input"
              />
            </Form.Item>
          </div>

          <div className="section">
            <Text strong>2. Tasks</Text>
            <div className="tasks-container">
              <Card className="tasks-section" size="small" title="Team Tasks">
                <Select
                  placeholder="Select from team tasks"
                  className="task-select"
                  onChange={handleTeamTaskSelect}
                >
                  {teamTasks.map((task) => (
                    <Select.Option key={task.id} value={task.id}>
                      {task.title}
                    </Select.Option>
                  ))}
                </Select>
              </Card>

              <Card
                className="tasks-section"
                size="small"
                title="Personal Tasks"
              >
                <Form.Item name="newTask" noStyle>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input
                      placeholder="Add a personal task"
                      onPressEnter={handleAddPersonalTask}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddPersonalTask}
                    >
                      Add
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Card>
            </div>

            <List
              className="tasks-list"
              itemLayout="horizontal"
              dataSource={selectedTasks}
              renderItem={(task) => (
                <List.Item>
                  <Space>
                    <Tag color="orange">Todo</Tag>
                    <Text>{task.title}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </div>

          <div className="submit-section">
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              loading={loading}
              htmlType="submit"
              className="submit-button"
            >
              Submit Check-in
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CheckInForm;
