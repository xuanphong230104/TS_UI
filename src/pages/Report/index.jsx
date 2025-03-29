import axiosClient from "../../helpers/axiosClient";
import { API_ENDPOINTS } from "../../constants";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";

import React, { useState, useEffect } from "react";
import {
  Card,
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
  Badge,
  Tooltip,
  Empty,
  Row,
  Col,
  Progress,
  Slider,
  Popconfirm,
  Popover,
} from "antd";
import {
  CheckOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FlagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../components/RichTextEditor";
import "./index.scss";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const EODReport = (props) => {
  const { authentication } = props;
  const { user } = authentication;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkinTasks, setCheckinTasks] = useState([]);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [reportContent, setReportContent] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [dailyReport, setDailyReport] = useState(null);
  const { teamId } = useParams();

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine if mobile view
  const isMobile = windowWidth < 768;

  // Fetch checked-in tasks
  useEffect(() => {
    fetchCheckinTasks(teamId);
    console.log("checkinTasks", checkinTasks);
  }, [teamId]);

  const fetchDailyReport = async (team) => {
    try {
      const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
      const response = await axiosClient.get(API_ENDPOINTS.FIND_CHECKIN_BY_ID, {
        params: {
          team: team,
          created_at: today,
          username: user.username,
        },
      });
      return response.data.data;
    } catch (error) {
      message.error("Failed to fetch daily report");
      console.error("Error fetching daily report:", error);
      return null;
    }
  };

  const fetchCheckinTasks = async (teamId) => {
    const TodayReport = await fetchDailyReport(teamId);
    try {
      const response = await axiosClient.get(
        API_ENDPOINTS.CHECKIN_BY_ID.replace("{id}", TodayReport.id)
      );
      console.log("response", response.data.data);
      setDailyReport(response.data.data);

      const tasksWithStatus = response.data.data.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        progress: task.progress,
        priority: task.priority,
        assignee: task.assignee,
        completionStatus: task.progress,
        reportNotes: "",
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));
      console.log("tasksWithStatus", tasksWithStatus);
      setCheckinTasks(tasksWithStatus);
    } catch (error) {
      message.error("Failed to fetch today's checked-in tasks");
      console.log("error", error);
    }
  };

  const updateTaskProgress = (taskId, progress) => {
    const updatedTasks = checkinTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completionStatus: progress,
            status: progress === 100 ? "Done" : "In Progress",
          }
        : task
    );
    setCheckinTasks(updatedTasks);

    // Auto-generate report content based on task statuses
    generateReportContent(updatedTasks);
  };

  const handleMarkAsDone = (taskId) => {
    updateTaskProgress(taskId, 100);
  };

  const handleProgressUpdate = (task) => {
    setCurrentTask(task);
    setProgressValue(task.completionStatus || 0);
    setProgressModalVisible(true);
  };

  const submitProgressUpdate = () => {
    updateTaskProgress(currentTask.id, progressValue);
    setProgressModalVisible(false);
    message.success(`Progress updated for task "${currentTask.title}"`);
  };

  const handleTaskNoteChange = (taskId, note) => {
    const updatedTasks = checkinTasks.map((task) =>
      task.id === taskId ? { ...task, reportNotes: note } : task
    );
    setCheckinTasks(updatedTasks);

    // Auto-generate report content based on updated notes
    generateReportContent(updatedTasks);
  };

  const generateReportContent = (tasks) => {
    let content = "";

    // Group tasks by status
    const completedTasks = tasks.filter((t) => t.completionStatus === 100);
    const inProgressTasks = tasks.filter(
      (t) => t.completionStatus > 0 && t.completionStatus < 100
    );
    const notStartedTasks = tasks.filter((t) => t.completionStatus === 0);

    if (completedTasks.length > 0) {
      content += "<h3>✅ Completed Tasks:</h3><ul>";
      completedTasks.forEach((task) => {
        content += `<li><strong>${task.title}</strong>${task.description ? ` - ${task.description}` : ""}${task.reportNotes ? ` - ${task.reportNotes}` : ""}</li>`;
      });
      content += "</ul>";
    }

    if (inProgressTasks.length > 0) {
      content += "<h3>🔄 In Progress Tasks:</h3><ul>";
      inProgressTasks.forEach((task) => {
        content += `<li><strong>${task.title}</strong>${task.description ? ` - ${task.description}` : ""} (${task.completionStatus}% complete)${task.reportNotes ? ` - ${task.reportNotes}` : ""}</li>`;
      });
      content += "</ul>";
    }

    if (notStartedTasks.length > 0) {
      content += "<h3>⏳ Not Started Tasks:</h3><ul>";
      notStartedTasks.forEach((task) => {
        content += `<li><strong>${task.title}</strong>${task.description ? ` - ${task.description}` : ""}${task.reportNotes ? ` - ${task.reportNotes}` : ""}</li>`;
      });
      content += "</ul>";
    }

    setReportContent(content);
  };

  const getStatusColor = (status) => {
    if (status === 100) return "#52c41a";
    if (status > 0) return "#1890ff";
    return "#d9d9d9";
  };

  const getTaskStatusText = (status) => {
    if (status === 100) return "Done";
    if (status > 0) return `In Progress (${status}%)`;
    return "Not Started";
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#f5222d";
      case "medium":
        return "#fa8c16";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const handleSubmit = async () => {
    if (checkinTasks.length === 0) {
      message.error("No tasks to report on");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post(API_ENDPOINTS.REPORT, {
        team_id: teamId,
        check_in_id: dailyReport.id,
        content: reportContent,
      });

      message.success("End-of-day report submitted successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to submit end-of-day report");
    } finally {
      setLoading(false);
    }
  };

  // Custom list item rendering for different screen sizes
  const renderTaskItem = (task) => {
    const statusColor = getStatusColor(task.completionStatus);
    const priorityColor = getPriorityColor(task.priority);

    const taskContent = (
      <Row gutter={16} align="middle" style={{ width: "100%" }}>
        <Col flex="auto">
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Text strong style={{ fontSize: "16px" }}>
                {task.title}
              </Text>
              <Tag
                color={priorityColor}
                style={{
                  margin: 0,
                  textTransform: "uppercase",
                  fontSize: "12px",
                }}
              >
                {task.priority}
              </Tag>
            </div>
            {task.description && (
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {task.description}
              </Text>
            )}
          </Space>
        </Col>
        <Col flex="360px">
          <Space size={16} style={{ width: "100%" }}>
            <Progress
              type="circle"
              percent={task.completionStatus}
              size="small"
              status={task.completionStatus === 100 ? "success" : "active"}
              strokeColor={statusColor}
              width={40}
              format={(percent) => (
                <Popover
                  content={
                    <div style={{ padding: "8px" }}>
                      <Input
                        size="small"
                        value={percent}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 100) {
                            updateTaskProgress(task.id, value);
                          }
                        }}
                        style={{ width: "60px" }}
                        autoFocus
                      />
                    </div>
                  }
                  trigger="click"
                  placement="bottom"
                >
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: statusColor,
                      cursor: "pointer",
                      userSelect: "none",
                      display: "block",
                      textAlign: "center",
                      lineHeight: "1",
                    }}
                  >
                    {percent === 100 ? "DONE" : `${percent}%`}
                  </Text>
                </Popover>
              )}
            />
            <Slider
              min={0}
              max={100}
              value={task.completionStatus}
              onChange={(value) => updateTaskProgress(task.id, value)}
              style={{ width: 500, marginLeft: 8 }}
              marks={{
                0: "0%",
                25: "25%",
                50: "50%",
                75: "75%",
                100: "100%",
              }}
              step={1}
              tooltip={{
                formatter: (value) => `${value}%`,
              }}
            />
          </Space>
        </Col>
      </Row>
    );

    if (isMobile) {
      return (
        <List.Item className="task-item mobile-task-item">
          <div style={{ width: "100%" }}>{taskContent}</div>
        </List.Item>
      );
    }

    return (
      <List.Item className="task-item">
        <div style={{ width: "100%" }}>{taskContent}</div>
      </List.Item>
    );
  };

  return (
    <div className="report-container">
      <Card className={`report-card ${isMobile ? "mobile-card" : ""}`}>
        <div className="card-header">
          <Title level={isMobile ? 3 : 2} className="page-title">
            <FlagOutlined className="title-icon" /> End-of-Day Report
          </Title>
          <Paragraph className="subtitle">
            Summarize your daily progress and update task statuses
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
            <Text strong className="section-title">
              <FileTextOutlined /> Report Content
            </Text>
            <Paragraph type="secondary" className="section-description">
              Your report will be automatically generated based on task statuses
              and notes
            </Paragraph>
            <RichTextEditor
              className="hovering-menu-animated"
              value={reportContent}
              onChange={(content) => setReportContent(content)}
            />
          </div>

          <div className="section tasks-section-container">
            <div className="section-header">
              <Text strong className="section-title">
                <FireOutlined /> Today's Tasks
              </Text>
              <Badge
                count={checkinTasks.length}
                color="#1890ff"
                className="task-counter"
                title="Total tasks"
              />
            </div>

            <List
              className={`tasks-list ${isMobile ? "mobile-list" : ""}`}
              itemLayout="horizontal"
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }}
              locale={{
                emptyText: (
                  <Empty description="No checked-in tasks found for today" />
                ),
              }}
              dataSource={checkinTasks}
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
              onClick={handleSubmit}
              className="submit-button"
              disabled={checkinTasks.length === 0}
              block={isMobile}
            >
              Submit Report
            </Button>
          </div>
        </Form>
      </Card>

      {/* Progress Update Modal */}
      <Modal
        title={
          <div className="modal-title">
            <EditOutlined /> Update Task Progress
          </div>
        }
        open={progressModalVisible}
        onOk={submitProgressUpdate}
        onCancel={() => setProgressModalVisible(false)}
        centered
        className="progress-modal"
        okText="Save Progress"
        width={isMobile ? "90%" : 520}
      >
        {currentTask && (
          <div>
            <Text strong>{currentTask.title}</Text>
            <div className="progress-slider-container">
              <Slider
                min={0}
                max={100}
                onChange={(value) => setProgressValue(value)}
                value={progressValue}
                marks={{
                  0: "0%",
                  25: "25%",
                  50: "50%",
                  75: "75%",
                  100: "100%",
                }}
                step={5}
              />
              <div className="progress-display">
                <Progress
                  type="circle"
                  percent={progressValue}
                  width={80}
                  format={(percent) => `${percent}%`}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return { authentication };
};

export default connect(mapStateToProps)(EODReport);
