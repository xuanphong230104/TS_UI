import { useState } from "react";
import {
  Card,
  Select,
  Input,
  Button,
  List,
  Tag,
  Typography,
  Space,
  message,
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

const Checkins = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [checkInContent, setCheckInContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  // Sample data
  const teams = [
    { id: 1, name: "Development Team" },
    { id: 2, name: "Design Team" },
    { id: 3, name: "Marketing Team" },
  ];

  const teamTasks = [
    { id: 1, title: "Sprint Planning Review" },
    { id: 2, title: "Code Review" },
    { id: 3, title: "Documentation Update" },
    { id: 4, title: "Team Meeting" },
  ];

  const handleAddPersonalTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          type: "personal",
          status: "Todo",
        },
      ]);
      setNewTask("");
    }
  };

  const handleTeamTaskSelect = (taskId) => {
    const selectedTask = teamTasks.find((task) => task.id === taskId);
    if (selectedTask && !tasks.find((t) => t.id === selectedTask.id)) {
      setTasks([
        ...tasks,
        {
          ...selectedTask,
          type: "team",
          status: "Todo",
        },
      ]);
    }
  };

  const handleSubmit = () => {
    if (!selectedTeam) {
      message.error("Please select a team first");
      return;
    }
    if (!checkInContent.trim()) {
      message.error("Please enter check-in content");
      return;
    }
    if (tasks.length === 0) {
      message.error("Please add at least one task");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success("Check-in submitted successfully!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="check-in-container">
      <Card className="check-in-card">
        <Title level={2} className="page-title">
          <ClockCircleOutlined /> Daily Check-in
        </Title>

        <div className="section">
          <Text strong>1. Select Your Team</Text>
          <Select
            placeholder="Choose your team"
            className="team-select"
            value={selectedTeam}
            onChange={setSelectedTeam}
          >
            {teams.map((team) => (
              <Select.Option key={team.id} value={team.id}>
                <TeamOutlined /> {team.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="section">
          <Text strong>2. Check-in Content</Text>
          <TextArea
            placeholder="What are your plans for today?"
            rows={4}
            value={checkInContent}
            onChange={(e) => setCheckInContent(e.target.value)}
            className="content-input"
          />
        </div>

        <div className="section">
          <Text strong>3. Tasks</Text>
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

            <Card className="tasks-section" size="small" title="Personal Tasks">
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  placeholder="Add a personal task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
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
            </Card>
          </div>

          <List
            className="tasks-list"
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item>
                <Space>
                  <CheckOutlined className="check-icon" />
                  <Text>{task.title}</Text>
                  <Tag color={task.type === "team" ? "blue" : "green"}>
                    {task.type === "team" ? "Team" : "Personal"}
                  </Tag>
                  <Tag color="orange">Todo</Tag>
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
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit Check-in
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Checkins;
