import React from 'react';
import { Progress, List, Tag, Tooltip } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  WarningOutlined,
  RocketOutlined
} from '@ant-design/icons';

const TaskProgressList = ({ tasks, compareMode = false }) => {
  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'processing';
      case 'not started':
        return 'default';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircleOutlined />;
      case 'in progress':
        return <ClockCircleOutlined />;
      case 'not started':
        return <InfoCircleOutlined />;
      case 'blocked':
        return <WarningOutlined />;
      default:
        return <RocketOutlined />;
    }
  };

  return (
    <List
      className="task-progress-list"
      itemLayout="horizontal"
      dataSource={tasks || []}
      renderItem={task => (
        <List.Item
          className={`task-item ${compareMode ? 'compare-mode' : ''}`}
        >
          <div className="task-content">
            <div className="task-header">
              <span className="task-title">
                {task.title}
              </span>
              <div className="task-tags">
                <Tag color={getPriorityColor(task.priority)}>
                  {task.priority || 'Medium'}
                </Tag>
                <Tag icon={getStatusIcon(task.status)} color={getStatusColor(task.status)}>
                  {task.status || 'Not Started'}
                </Tag>
              </div>
            </div>
            
            {task.description && (
              <div className="task-description">
                {task.description}
              </div>
            )}
            
            <div className="task-progress">
              <Progress 
                percent={task.progress || 0} 
                size="small"
                status={task.progress >= 100 ? "success" : "active"}
              />
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default TaskProgressList;