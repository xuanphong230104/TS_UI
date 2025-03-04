import axiosClient from "../../helpers/axiosClient";
import { API_ENDPOINTS } from "../../constants";
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
  Modal,
  Popconfirm,
  Badge,
  Tooltip,
  Empty,
  Row,
  Col
} from "antd";
import {
  PlusOutlined,
  CheckOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FileTextOutlined,
  FireOutlined,
  
} from "@ant-design/icons";
import HoveringMenu from "../../components/HoveringMenu";
import "./index.scss";

const { Title, Text, Paragraph } = Typography;


const CheckInForm = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine if mobile view
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

  // Fetch teams data
  useEffect(() => {
    axiosClient.get(API_ENDPOINTS.TASK).then((response) => {
      console.log("data", response.data);
      setTeamTasks(response.data.data);
    });
  }, []);
  
  // Fetch team tasks when team is selected
  const fetchTeamTasks = async (teamId) => {
    try {
      axiosClient
        .get(API_ENDPOINTS.TASK, { params: { teamId } })
        .then((response) => {
          console.log("data", response.data);
          setTeamTasks(response.data);
        });
    } catch (error) {
      message.error("Failed to fetch team tasks");
    }
  };

  const handleAddPersonalTask = () => {
    const taskValue = form.getFieldValue("newTask");
    if (taskValue?.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskValue,
        status: "Todo",
        createdAt: new Date().toISOString(),
      };
      setSelectedTasks([...selectedTasks, newTask]);
      form.setFieldsValue({ newTask: "" });
      message.success("Task added successfully");
    } else {
      message.warning("Please enter a task title");
    }
    form.resetFields(["newTask"]);
  };

  const handleTeamTaskSelect = (taskId) => {
    const task = teamTasks.find((t) => t.id === taskId);
    if (task && !selectedTasks.find((t) => t.id === task.id)) {
      const newTask = {
        ...task,
        status: "Todo",
        createdAt: new Date().toISOString(),
      };
      setSelectedTasks([...selectedTasks, newTask]);
      message.success("Team task added to your list");
    }
  };

  // Handle task edit
  const handleEditTask = (task) => {
    setCurrentEditTask(task);
    editForm.setFieldsValue({ taskTitle: task.title });
    setEditModalVisible(true);
  };

  // Save edited task
  const handleSaveEdit = () => {
    const newTitle = editForm.getFieldValue("taskTitle");
    if (newTitle?.trim()) {
      const updatedTasks = selectedTasks.map(task => 
        task.id === currentEditTask.id 
          ? { ...task, title: newTitle, updatedAt: new Date().toISOString() } 
          : task
      );
      setSelectedTasks(updatedTasks);
      setEditModalVisible(false);
      message.success("Task updated successfully");
    } else {
      message.error("Task title cannot be empty");
    }
  };

  // Handle task removal
  const handleRemoveTask = (taskId) => {
    const updatedTasks = selectedTasks.filter(task => task.id !== taskId);
    setSelectedTasks(updatedTasks);
    message.success("Task removed successfully");
  };

  const getRandomPastelColor = () => {
    // Generate random pastel colors for task tags
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Format date to relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
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

  // Custom list item rendering for different screen sizes
  const renderTaskItem = (task) => {
    const tagColor = getRandomPastelColor();
    
    if (isMobile) {
      return (
        <List.Item
          className="task-item mobile-task-item"
          actions={[
            <Space className="mobile-actions">
              <Button 
                icon={<EditOutlined />} 
                type="text" 
                size="small"
                onClick={() => handleEditTask(task)}
                className="action-button edit-button"
              />
              <Popconfirm
                title="Delete task?"
                description="Are you sure?"
                onConfirm={() => handleRemoveTask(task.id)}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button 
                  icon={<DeleteOutlined />} 
                  type="text" 
                  danger 
                  size="small"
                  className="action-button delete-button"
                />
              </Popconfirm>
            </Space>
          ]}
        >
          <div className="mobile-task-content">
            <div className="mobile-task-header">
              <Badge status="processing" />
              <Tag color={tagColor} className="status-tag">Todo</Tag>
              <Text className="task-title">{task.title}</Text>
            </div>
            {task.createdAt && (
              <div className="mobile-task-footer">
                <Text type="secondary" className="task-time">
                  <CalendarOutlined /> {getRelativeTime(task.createdAt)}
                </Text>
              </div>
            )}
          </div>
        </List.Item>
      );
    }
    
    return (
      <List.Item
        className="task-item"
        actions={[
          <Tooltip title="Edit task">
            <Button 
              icon={<EditOutlined />} 
              type="text" 
              onClick={() => handleEditTask(task)}
              className="action-button edit-button"
            />
          </Tooltip>,
          <Popconfirm
            title="Delete this task?"
            description="Are you sure you want to remove this task?"
            onConfirm={() => handleRemoveTask(task.id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <Tooltip title="Remove task">
              <Button 
                icon={<DeleteOutlined />} 
                type="text" 
                danger 
                className="action-button delete-button"
              />
            </Tooltip>
          </Popconfirm>
        ]}
      >
        <div className="task-content">
          <Badge status="processing" />
          <Tag color={tagColor} className="status-tag">Todo</Tag>
          <Text className="task-title">{task.title}</Text>
          {task.createdAt && (
            <Tooltip title={new Date(task.createdAt).toLocaleString()}>
              <Text type="secondary" className="task-time">
                <CalendarOutlined /> {getRelativeTime(task.createdAt)}
              </Text>
            </Tooltip>
          )}
        </div>
      </List.Item>
    );
  };

  return (
    <div className="check-in-container">
      <Card className={`check-in-card ${isMobile ? 'mobile-card' : ''}`}>
        <div className="card-header">
          <Title level={isMobile ? 3 : 2} className="page-title">
            <ClockCircleOutlined className="title-icon" /> Daily Check-in
          </Title>
          <Paragraph className="subtitle">
            Keep your team updated with your daily progress and tasks
          </Paragraph>
          <Divider className="divider-gradient" />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ tasks: [] }}
          className="animated-form"
        >
          <div className="section">
            <HoveringMenu tasks={selectedTasks} className="hovering-menu-animated"/>
          </div>

          <div className="section tasks-section-container">
            <div className="section-header">
              <Text strong className="section-title">
                <FireOutlined /> Tasks for Today
              </Text>
              <Badge 
                count={selectedTasks.length} 
                color="#1890ff" 
                className="task-counter"
                title="Total selected tasks"
              />
            </div>
            
            {/* Responsive tasks container */}
            <Row gutter={[16, 16]} className="tasks-row">
              <Col xs={24} sm={24} md={12} className="tasks-col">
                <Card 
                  className="tasks-section team-tasks" 
                  size="small" 
                  title={<span><TeamOutlined /> Team Tasks</span>}
                  extra={!isMobile && <Text type="secondary">{teamTasks.length} available</Text>}
                >
                  <Select
                    placeholder="Select from team tasks"
                    className="task-select"
                    onChange={handleTeamTaskSelect}
                    notFoundContent={<Empty description="No team tasks available" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                    optionFilterProp="children"
                    showSearch
                    dropdownMatchSelectWidth={false}
                  >
                    {teamTasks.map((task) => (
                      <Select.Option key={task.id} value={task.id}>
                        {task.title}
                      </Select.Option>
                    ))}
                  </Select>
                </Card>
              </Col>
              
              <Col xs={24} sm={24} md={12} className="tasks-col">
                <Card
                  className="tasks-section personal-tasks"
                  size="small"
                  title={<span><FileTextOutlined /> Personal Tasks</span>}
                >
                  <Form.Item name="newTask" noStyle>
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        placeholder="Add a personal task"
                        onPressEnter={handleAddPersonalTask}
                        prefix={<PlusOutlined className="input-icon" />}
                        className="task-input"
                      />
                      <Button
                        type="primary"
                        icon={!isMobile && <PlusOutlined />}
                        onClick={handleAddPersonalTask}
                        className="add-button"
                      >
                        {isMobile ? "+" : "Add"}
                      </Button>
                    </Space.Compact>
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <List
              className={`tasks-list ${isMobile ? 'mobile-list' : ''}`}
              itemLayout="horizontal"
              locale={{ emptyText: <Empty description="No tasks selected yet" /> }}
              dataSource={selectedTasks}
              renderItem={renderTaskItem}
            />
          </div>

          <Divider className="divider-gradient" />

          <div className="submit-section">
            <Button
              type="primary"
              size={isMobile ? "middle" : "large"}
              icon={<CheckOutlined />}
              loading={loading}
              htmlType="submit"
              className="submit-button"
              disabled={selectedTasks.length === 0}
              block={isMobile}
            >
              Submit Check-in
            </Button>
          </div>
        </Form>
      </Card>

      {/* Edit Task Modal */}
      <Modal
        title={<div className="modal-title"><EditOutlined /> Edit Task</div>}
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        centered
        className="edit-modal"
        okText="Save Changes"
        width={isMobile ? "90%" : 520}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item 
            name="taskTitle" 
            label="Task Title" 
            rules={[{ required: true, message: "Please enter task title" }]}
          >
            <Input autoFocus className="edit-input" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CheckInForm;