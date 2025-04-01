import React, { useEffect, useState } from 'react';
import {
  Card,
  List,
  Avatar,
  Button,
  Input,
  Dropdown,
  Spin,
  Collapse,
  Divider,
  Tag,
  Tabs
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  SettingOutlined,
  UserOutlined,
  DownOutlined,
  SwapOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  SyncOutlined
} from '@ant-design/icons';
import TaskProgressList from '../TaskProgressList';
import RichTextEditor from '../../components/RichTextEditor';
import { API_ENDPOINTS } from '../../constants';
import axiosClient from '../../helpers/axiosClient';
import './index.scss';

const { TextArea } = Input;
const { Panel } = Collapse;

const ReportSection = ({ teamId, user, activeTabKey }) => {
  const [reports, setReports] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [commentVisibleMap, setCommentVisibleMap] = useState({});
  const [newCommentMap, setNewCommentMap] = useState({});
  const [replyToMap, setReplyToMap] = useState({});
  const [isSubmittingComment, setIsSubmittingComment] = useState({});
  const [showCheckInsMap, setShowCheckInsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTabKey === 'reports' || activeTabKey === 'allUpdates') {
      fetchReports();
      fetchCheckIns();
    }
  }, [teamId, activeTabKey]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(API_ENDPOINTS.REPORT, { params: { team: teamId } });
      setReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckIns = async () => {
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CHECKIN, { params: { team: teamId } });
      setCheckIns(response.data.data || []);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const toggleCommentSection = (reportId) => {
    setCommentVisibleMap(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const toggleCheckInsSection = (reportId) => {
    setShowCheckInsMap(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const handleCommentChange = (reportId, e) => {
    setNewCommentMap(prev => ({
      ...prev,
      [reportId]: e.target.value
    }));
  };

  const handleReplyClick = (reportId, commentId) => {
    setReplyToMap(prev => ({
      ...prev,
      [reportId]: commentId
    }));
  };

  const handleCancelReply = (reportId) => {
    setReplyToMap(prev => ({
      ...prev,
      [reportId]: null
    }));
    setNewCommentMap(prev => ({
      ...prev,
      [reportId]: ''
    }));
  };

  const handleSubmitComment = async (reportId) => {
    const newComment = newCommentMap[reportId];
    if (!newComment || newComment.trim() === '') return;

    setIsSubmittingComment(prev => ({ ...prev, [reportId]: true }));

    try {
      const commentData = {
        team_id: teamId,
        content: newComment,
        content_type: 'report',
        object_id: reportId,
        parent_id: replyToMap[reportId] || null
      };

      const response = await axiosClient.post(API_ENDPOINTS.COMMENT, commentData);
      const newCommentFromServer = response.data;

      // Update local state
      setReports(prevReports => {
        return prevReports.map(report => {
          if (report.id === reportId) {
            if (replyToMap[reportId]) {
              // Add as a reply to existing comment
              return {
                ...report,
                comments: report.comments.map(comment => {
                  if (comment.id === replyToMap[reportId]) {
                    return {
                      ...comment,
                      children: [
                        ...(comment.children || []),
                        newCommentFromServer
                      ]
                    };
                  }
                  return comment;
                })
              };
            } else {
              // Add as a new top-level comment
              return {
                ...report,
                comments: [...(report.comments || []), newCommentFromServer]
              };
            }
          }
          return report;
        });
      });

      // Clear input and reply state
      setNewCommentMap(prev => ({
        ...prev,
        [reportId]: ''
      }));
      setReplyToMap(prev => ({
        ...prev,
        [reportId]: null
      }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(prev => ({ ...prev, [reportId]: false }));
    }
  };

  const handleKeyPress = (reportId, e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(reportId);
    }
  };

  // Format time difference
  const formatTimeDiff = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffSeconds = Math.floor((now - created) / 1000);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;

    return created.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  // Group reports by date
  const groupReportsByDate = (reports) => {
    const grouped = {};

    reports.forEach(report => {
      const date = new Date(report.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
      const weekday = new Date(report.created_at).toLocaleDateString('en-US', {
        weekday: 'long'
      });

      if (!grouped[date]) {
        grouped[date] = {
          weekday,
          reports: []
        };
      }
      grouped[date].reports.push(report);
    });
    return grouped;
  };

  // Get associated check-in for a report
  const getAssociatedCheckIn = (report) => {
    if (!report || !report.check_in || !report.check_in.id) return null;
    return report.check_in;
  };

  // Calculate total comments
  const getCommentCount = (comments = []) => {
    return comments.reduce((total, comment) => {
      let count = 1;
      if (comment.children && comment.children.length > 0) {
        count += getCommentCount(comment.children);
      }
      return total + count;
    }, 0);
  };

  // Sort comments by date
  const sortComments = (comments = []) => {
    return [...comments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  };

  // Render a comment
  const renderComment = (comment, reportId, level = 0) => {
    return (
      <div key={comment.id} style={{ marginLeft: level * 24 }}>
        <List.Item className="comment-item">
          <div className="comment-avatar">
            <Avatar>
              {comment.created_by?.username?.substring(0, 2).toUpperCase() || 'UN'}
            </Avatar>
          </div>
          <div className="comment-content">
            <div className="comment-author">
              {comment.created_by?.username || 'Unknown User'}
            </div>
            <div className="comment-text">{comment.content}</div>
            <div className="comment-footer">
              <span className="comment-time">
                {formatTimeDiff(comment.created_at)}
              </span>
              <Button type="link" onClick={() => handleReplyClick(reportId, comment.id)}>
                Reply
              </Button>
            </div>
          </div>
        </List.Item>

        {comment.children?.map(child => renderComment(child, reportId, level + 1))}

        {replyToMap[reportId] === comment.id && (
          <div className="reply-input" style={{ marginLeft: (level + 1) * 24 }}>
            <div className="new-comment">
              <div className="comment-avatar">
                <Avatar>{user?.username?.substring(0, 2).toUpperCase() || 'UN'}</Avatar>
              </div>
              <div className="comment-input-container">
                <TextArea
                  value={newCommentMap[reportId] || ''}
                  onChange={(e) => handleCommentChange(reportId, e)}
                  onKeyDown={(e) => handleKeyPress(reportId, e)}
                  placeholder="Write a reply..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="comment-input"
                  disabled={isSubmittingComment[reportId]}
                />
                <Button
                  type="primary"
                  icon={isSubmittingComment[reportId] ? <Spin size="small" /> : <SendOutlined />}
                  onClick={() => handleSubmitComment(reportId)}
                  disabled={!newCommentMap[reportId]?.trim() || isSubmittingComment[reportId]}
                  className="send-button"
                />
                <Button
                  onClick={() => handleCancelReply(reportId)}
                  style={{ marginLeft: 8 }}
                  disabled={isSubmittingComment[reportId]}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading && reports.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div className="reports-section">
      {Object.entries(groupReportsByDate(reports)).map(([date, { weekday, reports: dateReports }]) => (
        <div key={date}>
          <div className="time-card">
            <div className="date-text">{weekday}</div>
            <div className="time-text">{date}</div>
          </div>

          {dateReports.map(report => (
            <div key={report.id} className="post-container">
              <div className="post-header">
                <div className="avatar">
                  {report.created_by?.username?.substring(0, 2).toUpperCase() || 'NP'}
                </div>
                <div className="post-info">
                  <p className="post-author">
                    {report.created_by?.username?.toUpperCase() || 'UNKNOWN USER'}
                  </p>
                  <p className="post-time">
                    {formatTimeDiff(report.created_at)}
                    <Tag color="blue" style={{ marginLeft: 8 }}>Report</Tag>
                  </p>
                </div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'edit',
                        label: 'Edit',
                        icon: <SettingOutlined />
                      },
                      {
                        key: 'view-detail',
                        label: 'View Detail',
                        icon: <UserOutlined />
                      }
                    ]
                  }}
                  trigger={['click']}
                >
                  <div className="post-menu">...</div>
                </Dropdown>
              </div>

              <div className="post-content">
                <div className="post-section">
                  <RichTextEditor
                    initValue={report.content}
                    readOnly={true}
                  />
                  
                  {/* Task section */}
                  {report.tasks && report.tasks.length > 0 && (
                    <div className="tasks-section">
                      <Divider orientation="left">
                        <CheckSquareOutlined /> Tasks ({report.tasks.length})
                      </Divider>
                      {/* <TaskProgressList tasks={report.tasks} /> */}
                    </div>
                  )}
                </div>
                
                <div className="post-footer">
                  <div
                    className={`comment-section ${commentVisibleMap[report.id] ? 'active' : ''}`}
                    onClick={() => toggleCommentSection(report.id)}
                  >
                    <MessageOutlined />
                    <span>{getCommentCount(report.comments)} comments</span>
                  </div>
                  
                  <div
                    className={`comment-section ${showCheckInsMap[report.id] ? 'active' : ''}`}
                    onClick={() => toggleCheckInsSection(report.id)}
                  >
                    <SwapOutlined />
                    <span>Show Check-in</span>
                  </div>
                </div>

                {showCheckInsMap[report.id] && (
                  <div className="checkin-comparison">
                    <Divider orientation="left">
                      <CalendarOutlined /> Associated Check-in
                    </Divider>
                    {report.check_in ? (
                      <div className="checkin-content">
                        <div className="checkin-header">
                          <Avatar size="small">
                            {report.check_in.created_by?.username?.substring(0, 2).toUpperCase() || 'CI'}
                          </Avatar>
                          <span className="checkin-author">
                            {report.check_in.created_by?.username || 'Unknown'} · {formatTimeDiff(report.check_in.created_at)}
                          </span>
                        </div>
                        <div className="checkin-body">
                          <RichTextEditor
                            initValue={report.check_in.content}
                            readOnly={true}
                          />
                        </div>
                        
                        {/* Task comparison section */}
                        {report.tasks && report.tasks.length > 0 && report.check_in.tasks && report.check_in.tasks.length > 0 && (
                          <div className="task-comparison">
                            <div className="comparison-header">
                              <div className="comparison-title">
                                <SyncOutlined /> Task Progress Comparison
                              </div>
                            </div>
                            
                            <div className="comparison-grid">
                              <div className="comparison-column">
                                <h4>Check-in Tasks</h4>
                                <TaskProgressList 
                                  tasks={report.check_in.tasks} 
                                  compareMode={true} 
                                />
                              </div>
                              
                              <div className="comparison-column">
                                <h4>Report Tasks</h4>
                                <TaskProgressList 
                                  tasks={report.tasks} 
                                  compareMode={true} 
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-checkin">No associated check-in found</div>
                    )}
                  </div>
                )}

                {commentVisibleMap[report.id] && (
                  <div className="comments-container">
                    <List
                      itemLayout="horizontal"
                      dataSource={sortComments(report.comments) || []}
                      className="comments-list"
                      renderItem={comment => renderComment(comment, report.id)}
                    />

                    {!replyToMap[report.id] && (
                      <div className="new-comment">
                        <div className="comment-avatar">
                          <Avatar>
                            {user?.username?.substring(0, 2).toUpperCase() || 'UN'}
                          </Avatar>
                        </div>
                        <div className="comment-input-container">
                          <TextArea
                            value={newCommentMap[report.id] || ''}
                            onChange={(e) => handleCommentChange(report.id, e)}
                            onKeyDown={(e) => handleKeyPress(report.id, e)}
                            placeholder="Write a comment..."
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            className="comment-input"
                            disabled={isSubmittingComment[report.id]}
                          />
                          <Button
                            type="primary"
                            icon={isSubmittingComment[report.id] ? <Spin size="small" /> : <SendOutlined />}
                            onClick={() => handleSubmitComment(report.id)}
                            disabled={!newCommentMap[report.id]?.trim() || isSubmittingComment[report.id]}
                            className="comment-send"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ReportSection;