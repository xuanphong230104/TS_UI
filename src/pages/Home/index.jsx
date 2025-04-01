import {
  Card,
  Col,
  Row,
  Input,
  Button,
  Avatar,
  List,
  Dropdown,
  Spin,
  Empty,
  Tag
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./index.scss";
import RichTextEditor from "../../components/RichTextEditor";
import { API_ENDPOINTS } from "../../constants";
import axiosClient from "../../helpers/axiosClient";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import ReportSection from "../../components/ReportSection";

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

const Home = (props) => {
  const { authentication } = props;
  const { user } = authentication;
  const [projectTabsKey, setProjectsTabKey] = useState("allUpdates");
  const [commentVisibleMap, setCommentVisibleMap] = useState({});
  const [newCommentMap, setNewCommentMap] = useState({});
  const [replyToMap, setReplyToMap] = useState({}); // Track which comment we're replying to
  const [checkIns, setCheckIns] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState({});
  const [loading, setLoading] = useState(false);
  const { teamId } = useParams();

  const onProjectsTabChange = (key) => {
    setProjectsTabKey(key);
  };

  const toggleCommentSection = (checkInId) => {
    console.log("Clicked comment button for check-in ID:", checkInId);
    setCommentVisibleMap((prev) => ({
      ...prev,
      [checkInId]: !prev[checkInId],
    }));
  };

  const handleCommentChange = (checkInId, e) => {
    setNewCommentMap((prev) => ({
      ...prev,
      [checkInId]: e.target.value,
    }));
  };

  const handleReplyClick = (checkInId, commentId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [checkInId]: commentId,
    }));
  };

  const handleCancelReply = (checkInId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [checkInId]: null,
    }));
    setNewCommentMap((prev) => ({
      ...prev,
      [checkInId]: "",
    }));
  };

  const handleSubmitComment = async (checkInId) => {
    const newComment = newCommentMap[checkInId];
    if (!newComment || newComment.trim() === "") return;

    setIsSubmittingComment((prev) => ({ ...prev, [checkInId]: true }));

    try {
      const commentData = {
        team_id: teamId,
        content: newComment,
        content_type: "checkin",
        object_id: checkInId,
        parent_id: replyToMap[checkInId] || null,
      };

      const response = await axiosClient.post(
        API_ENDPOINTS.COMMENT,
        commentData
      );
      const newCommentFromServer = response.data;

      // Update local state
      setCheckIns((prevCheckIns) => {
        return prevCheckIns.map((checkIn) => {
          if (checkIn.id === checkInId) {
            if (replyToMap[checkInId]) {
              // Add as a reply to existing comment
              return {
                ...checkIn,
                comments: checkIn.comments.map((comment) => {
                  if (comment.id === replyToMap[checkInId]) {
                    return {
                      ...comment,
                      children: [
                        ...(comment.children || []),
                        newCommentFromServer,
                      ],
                    };
                  }
                  return comment;
                }),
              };
            } else {
              // Add as a new top-level comment at the end
              return {
                ...checkIn,
                comments: [...(checkIn.comments || []), newCommentFromServer],
              };
            }
          }
          return checkIn;
        });
      });

      // Clear input and reply state
      setNewCommentMap((prev) => ({
        ...prev,
        [checkInId]: "",
      }));
      setReplyToMap((prev) => ({
        ...prev,
        [checkInId]: null,
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [checkInId]: false }));
    }
  };

  const handleKeyPress = (checkInId, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(checkInId);
    }
  };

  useEffect(() => {
    if (projectTabsKey === "allUpdates" || projectTabsKey === "checkIns") {
      fetchCheckIns();
    }
  }, [teamId, projectTabsKey, isSubmittingComment]);

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CHECKIN, { 
        params: { team: teamId } 
      });
      setCheckIns(response.data.data || []);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the time difference
  const formatTimeDiff = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffSeconds = Math.floor((now - created) / 1000);

    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600)
      return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400)
      return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800)
      return `${Math.floor(diffSeconds / 86400)} days ago`;

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
    const grouped = {};
    // Filter check-ins based on the current tab
    const filteredCheckIns = checkIns.filter((checkIn) => {
      if (projectTabsKey === "allUpdates") return true;
      if (projectTabsKey === "checkIns") return true;
      return false;
    });

    filteredCheckIns.forEach((checkIn) => {
      const date = new Date(checkIn.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      const weekday = new Date(checkIn.created_at).toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (!grouped[date]) {
        grouped[date] = {
          weekday,
          checkIns: [],
        };
      }
      grouped[date].checkIns.push(checkIn);
    });
    return grouped;
  };

  // Function to calculate total comments (including replies)
  const getCommentCount = (comments = []) => {
    return comments.reduce((total, comment) => {
      // Count the comment itself
      let count = 1;
      // Add counts of all child comments recursively
      if (comment.children && comment.children.length > 0) {
        count += getCommentCount(comment.children);
      }
      return total + count;
    }, 0);
  };

  // Sort comments by date before rendering (oldest to newest)
  const sortComments = (comments = []) => {
    return [...comments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  };

  const renderComment = (comment, checkInId, level = 0) => {
    return (
      <div key={comment.id} style={{ marginLeft: level * 24 }}>
        <List.Item className="comment-item">
          <div className="comment-avatar">
            <Avatar>
              {comment.created_by?.username?.substring(0, 2).toUpperCase() ||
                "UN"}
            </Avatar>
          </div>
          <div className="comment-content">
            <div className="comment-author">
              {comment.created_by?.username || "Unknown User"}
            </div>
            <div className="comment-text">{comment.content}</div>
            <div className="comment-footer">
              <span className="comment-time">
                {formatTimeDiff(comment.created_at)}
              </span>
              <Button
                type="link"
                onClick={() => handleReplyClick(checkInId, comment.id)}
              >
                Reply
              </Button>
            </div>
          </div>
        </List.Item>

        {comment.children?.map((child) =>
          renderComment(child, checkInId, level + 1)
        )}

        {replyToMap[checkInId] === comment.id && (
          <div className="reply-input" style={{ marginLeft: (level + 1) * 24 }}>
            <div className="new-comment">
              <div className="comment-avatar">
                <Avatar>{user?.username?.substring(0, 2).toUpperCase() || "UN"}</Avatar>
              </div>
              <div className="comment-input-container">
                <TextArea
                  value={newCommentMap[checkInId] || ""}
                  onChange={(e) => handleCommentChange(checkInId, e)}
                  onKeyDown={(e) => handleKeyPress(checkInId, e)}
                  placeholder="Write a reply..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="comment-input"
                  disabled={isSubmittingComment[checkInId]}
                />
                <Button
                  type="primary"
                  icon={
                    isSubmittingComment[checkInId] ? (
                      <Spin size="small" />
                    ) : (
                      <SendOutlined />
                    )
                  }
                  onClick={() => handleSubmitComment(checkInId)}
                  disabled={
                    !newCommentMap[checkInId]?.trim() ||
                    isSubmittingComment[checkInId]
                  }
                  className="send-button"
                />
                <Button
                  onClick={() => handleCancelReply(checkInId)}
                  style={{ marginLeft: 8 }}
                  disabled={isSubmittingComment[checkInId]}
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

  const renderCheckInContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
    }

    if (checkIns.length === 0) {
      return <Empty description="No check-ins found" />;
    }

    return (
      <div className="updates-container">
        {Object.entries(groupCheckInsByDate(checkIns)).map(
          ([date, { weekday, checkIns: groupedCheckIns }]) => (
            <div key={date}>
              <div className="time-card">
                <div className="date-text">{weekday}</div>
                <div className="time-text">{date}</div>
              </div>

              {groupedCheckIns.map((checkIn) => (
                <div key={checkIn.id} className="post-container">
                  <div className="post-header">
                    <div className="avatar">
                      {checkIn.created_by?.username
                        ?.substring(0, 2)
                        .toUpperCase() || "NP"}
                    </div>
                    <div className="post-info">
                      <p className="post-author">
                        {checkIn.created_by?.username?.toUpperCase() ||
                          "UNKNOWN USER"}
                      </p>
                      <p className="post-time">
                        {formatTimeDiff(checkIn.created_at)}
                        <Tag color="green" style={{ marginLeft: 8 }}>Check-in</Tag>

                      </p>
                    </div>
                    <div className="post-tag">Check-in</div>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "edit",
                            label: "Edit",
                            icon: <SettingOutlined />,
                          },
                          {
                            key: "view-detail",
                            label: "View Detail",
                            icon: <UserOutlined />,
                          },
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <div className="post-menu">...</div>
                    </Dropdown>
                  </div>

                  <div className="post-content">
                    <div className="post-section">
                      <RichTextEditor
                        initValue={
                          checkIn.object?.content || checkIn.content
                        }
                        readOnly={true}
                      />
                    </div>
                    <div className="post-footer">
                      <div
                        className={`comment-section ${commentVisibleMap[checkIn.id] ? "active" : ""}`}
                        onClick={() => toggleCommentSection(checkIn.id)}
                      >
                        <MessageOutlined />
                        <span>
                          {getCommentCount(checkIn.comments)} comments
                        </span>
                      </div>
                    </div>

                    {commentVisibleMap[checkIn.id] && (
                      <div className="comments-container">
                        <List
                          itemLayout="horizontal"
                          dataSource={
                            sortComments(checkIn.comments) || []
                          }
                          className="comments-list"
                          renderItem={(comment) =>
                            renderComment(comment, checkIn.id)
                          }
                        />

                        {!replyToMap[checkIn.id] && (
                          <div className="new-comment">
                            <div className="comment-avatar">
                              <Avatar>
                                {user?.username
                                  ?.substring(0, 2)
                                  .toUpperCase() || "UN"}
                              </Avatar>
                            </div>
                            <div className="comment-input-container">
                              <TextArea
                                value={newCommentMap[checkIn.id] || ""}
                                onChange={(e) =>
                                  handleCommentChange(checkIn.id, e)
                                }
                                onKeyDown={(e) =>
                                  handleKeyPress(checkIn.id, e)
                                }
                                placeholder="Write a comment..."
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                className="comment-input"
                                disabled={isSubmittingComment[checkIn.id]}
                              />
                              <Button
                                type="primary"
                                icon={
                                  isSubmittingComment[checkIn.id] ? (
                                    <Spin size="small" />
                                  ) : (
                                    <SendOutlined />
                                  )
                                }
                                onClick={() =>
                                  handleSubmitComment(checkIn.id)
                                }
                                disabled={
                                  !newCommentMap[checkIn.id]?.trim() ||
                                  isSubmittingComment[checkIn.id]
                                }
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
          )
        )}
      </div>
    );
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
            {projectTabsKey === "reports" || projectTabsKey === "allUpdates" ? (
              <div>
                {projectTabsKey === "allUpdates" && renderCheckInContent()}
                <ReportSection 
                  teamId={teamId} 
                  user={user} 
                  activeTabKey={projectTabsKey} 
                />
              </div>
            ) : (
              renderCheckInContent()
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return { authentication };
};

export default connect(mapStateToProps)(Home);