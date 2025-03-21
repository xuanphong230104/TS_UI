import { Card, Col, Row, Input, Button, Avatar, List, Dropdown } from "antd";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./index.scss";
import RichTextEditor from "../../components/RichTextEditor";
import { API_ENDPOINTS } from "../../constants";
import axiosClient from "../../helpers/axiosClient";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

const PROJECT_TABS = [
  {
    key: "allUpdates",
    label: "All Updates",
  },
  {
    key: "checkIns",
    label: "Check-ins",
  },
  {
    key: "reports",
    label: "Reports",
  },
];

// Sample comment data
const initialComments = [
  {
    id: 1,
    author: "Jane Doe",
    avatar: "JD",
    content: "Great update! Looking forward to the next phase.",
    datetime: "1 day ago",
  },
  {
    id: 2,
    author: "John Smith",
    avatar: "JS",
    content: "Can we discuss this further in the next meeting?",
    datetime: "5 hours ago",
  },
];

const Home = () => {
  const [projectTabsKey, setProjectsTabKey] = useState("allUpdates");
  const [commentVisibleMap, setCommentVisibleMap] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [newCommentMap, setNewCommentMap] = useState({});
  const [commentCountMap, setCommentCountMap] = useState({});
  const [checkIns, setCheckIns] = useState([]);
  const { teamId } = useParams();
  
  const onProjectsTabChange = (key) => {
    setProjectsTabKey(key);
  };

  const toggleCommentSection = (checkInId) => {
    setCommentVisibleMap(prev => ({
      ...prev,
      [checkInId]: !prev[checkInId]
    }));
  };

  const handleCommentChange = (checkInId, e) => {
    setNewCommentMap(prev => ({
      ...prev,
      [checkInId]: e.target.value
    }));
  };

  const handleSubmitComment = (checkInId) => {
    const newComment = newCommentMap[checkInId];
    if (!newComment || newComment.trim() === "") return;

    const currentComments = commentsMap[checkInId] || [];
    
    const newCommentObj = {
      id: currentComments.length + 1,
      author: "NGUYEN PHONG", // Current user
      avatar: "NP",
      content: newComment,
      datetime: "Just now",
    };

    const updatedComments = [...currentComments, newCommentObj];
    
    setCommentsMap(prev => ({
      ...prev,
      [checkInId]: updatedComments
    }));
    
    setCommentCountMap(prev => ({
      ...prev,
      [checkInId]: (prev[checkInId] || 0) + 1
    }));
    
    setNewCommentMap(prev => ({
      ...prev,
      [checkInId]: ""
    }));
  };

  const handleKeyPress = (checkInId, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(checkInId);
    }
  };

  // Initialize comment data for each check-in
  useEffect(() => {
    if (checkIns.length > 0) {
      const initialCommentsMap = {};
      const initialCommentCountMap = {};
      
      checkIns.forEach(checkIn => {
        initialCommentsMap[checkIn.id] = [...initialComments];
        initialCommentCountMap[checkIn.id] = initialComments.length;
      });
      
      setCommentsMap(initialCommentsMap);
      setCommentCountMap(initialCommentCountMap);
    }
  }, [checkIns]);

  useEffect(() => {
    axiosClient
      .get(API_ENDPOINTS.CHECKIN, { params: { team: teamId } })
      .then((res) => {
        setCheckIns(res.data.data);
      });
  }, [teamId]);
  
  console.log("checkIns", checkIns);
  
  // Function to format the time difference
  const formatTimeDiff = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffSeconds = Math.floor((now - created) / 1000);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;

    return created.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };

  // Function to group check-ins by date
  const groupCheckInsByDate = (checkIns) => {
    const groups = {};
    checkIns.forEach(checkIn => {
      const date = new Date(checkIn.created_at);
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(checkIn);
    });
    
    // Sort check-ins within each date group by time (newest first)
    Object.keys(groups).forEach(dateKey => {
      groups[dateKey].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    });

    // Convert to array of [date, checkIns] pairs and sort by date (newest first)
    const sortedGroups = Object.entries(groups).sort(([dateA], [dateB]) => {
      return new Date(dateB) - new Date(dateA);
    });

    // Convert back to object with sorted dates
    return Object.fromEntries(sortedGroups);
  };

  return (
    <div>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card
            className="dashboard-card"
            variant="outlined"
            style={{ boxShadow: "none" }}
            tabList={PROJECT_TABS}
            activeTabKey={projectTabsKey}
            onTabChange={onProjectsTabChange}
            styles={{ body: { padding: 0 } }}
          >
            <div className="updates-container">
              {Object.entries(groupCheckInsByDate(checkIns)).map(([date, dateCheckIns]) => (
                <div key={date}>
                  <div className="time-card">
                    <div className="date-text">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </div>
                    <div className="time-text">
                      {new Date(date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {dateCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="post-container">
                      <div className="post-header">
                        <div className="avatar">
                          {checkIn.created_by?.username?.substring(0, 2).toUpperCase() || "NP"}
                        </div>
                        <div className="post-info">
                          <p className="post-author">
                            {checkIn.created_by?.username?.toUpperCase() || "UNKNOWN USER"}
                          </p>
                          <p className="post-time">
                            {formatTimeDiff(checkIn.created_at)}
                          </p>
                        </div>
                        <Dropdown
                          menu={{
                            items: [
                              {
                                key: "edit",
                                label: "Edit",
                              },
                              {
                                key: "view", 
                                label: "View",
                              }
                            ]
                          }}
                          trigger={["click"]}
                        >
                          <div className="post-menu">...</div>
                        </Dropdown>
                      </div>

                      <div className="post-content">
                        <div className="post-section">
                          <RichTextEditor initValue={checkIn} readOnly={true} />
                        </div>
                        <div className="post-footer">
                          <div
                            className={`comment-section ${commentVisibleMap[checkIn.id] ? "active" : ""}`}
                            onClick={() => toggleCommentSection(checkIn.id)}
                          >
                            <MessageOutlined />
                            <span>{commentCountMap[checkIn.id] || 0} comments</span>
                          </div>
                        </div>

                        {commentVisibleMap[checkIn.id] && (
                          <div className="comments-container">
                            <List
                              itemLayout="horizontal"
                              dataSource={commentsMap[checkIn.id] || []}
                              className="comments-list"
                              renderItem={(item) => (
                                <List.Item key={item.id} className="comment-item">
                                  <div className="comment-avatar">
                                    <Avatar>{item.avatar}</Avatar>
                                  </div>
                                  <div className="comment-content">
                                    <div className="comment-author">
                                      {item.author}
                                    </div>
                                    <div className="comment-text">{item.content}</div>
                                    <div className="comment-time">
                                      {item.datetime}
                                    </div>
                                  </div>
                                </List.Item>
                              )}
                            />

                            <div className="new-comment">
                              <div className="comment-avatar">
                                <Avatar>NP</Avatar>
                              </div>
                              <div className="comment-input-container">
                                <TextArea
                                  value={newCommentMap[checkIn.id] || ""}
                                  onChange={(e) => handleCommentChange(checkIn.id, e)}
                                  onKeyDown={(e) => handleKeyPress(checkIn.id, e)}
                                  placeholder="Write a comment..."
                                  autoSize={{ minRows: 1, maxRows: 4 }}
                                  className="comment-input"
                                />
                                <Button
                                  type="primary"
                                  icon={<SendOutlined />}
                                  onClick={() => handleSubmitComment(checkIn.id)}
                                  disabled={!newCommentMap[checkIn.id]?.trim()}
                                  className="send-button"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;