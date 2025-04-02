import {
  Card,
  Col,
  Row,
  Empty,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import axiosClient from "../../helpers/axiosClient";
import { API_ENDPOINTS } from "../../constants";
import ReportSection from "../../components/ReportSection";
import TimeHeader from "../../components/TimeHeader";
import CheckInCard from "../../components/CheckInCard";
import { formatTimeDiff,groupItemsByDate } from "../../utils/dateUtils";
import { updateNestedComments } from "../../utils/commentUtils";

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

  // Comment handlers
  const toggleCommentSection = (checkInId) => {
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

  const handleKeyPress = (checkInId, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(checkInId);
    }
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

      const response = await axiosClient.post(API_ENDPOINTS.COMMENT, commentData);
      const newCommentFromServer = response.data;

      // Update local state
      setCheckIns((prevCheckIns) => {
        return prevCheckIns.map((checkIn) => {
          if (checkIn.id === checkInId) {
            if (replyToMap[checkInId]) {
              // Add as a reply to existing comment
              return {
                ...checkIn,
                comments: updateNestedComments(checkIn.comments, replyToMap[checkInId], newCommentFromServer)
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

  // Data fetching
  useEffect(() => {
    if (projectTabsKey === "allUpdates" || projectTabsKey === "checkIns") {
      loadCheckIns();
    }
  }, [teamId, projectTabsKey]);

  const loadCheckIns = async () => {
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

  // Comment handlers object to pass to components
  const commentHandlers = {
    onReplyClick: handleReplyClick,
    replyToMap,
    onCancelReply: handleCancelReply,
    newCommentMap,
    onCommentChange: handleCommentChange,
    onKeyPress: handleKeyPress,
    onSubmitComment: handleSubmitComment,
    isSubmittingComment,
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
              <TimeHeader weekday={weekday} date={date} />

              {groupedCheckIns.map((checkIn) => (
                <CheckInCard
                  key={checkIn.id}
                  checkIn={checkIn}
                  formatTimeDiff={formatTimeDiff}
                  commentVisibleMap={commentVisibleMap}
                  toggleCommentSection={toggleCommentSection}
                  getCommentCount={getCommentCount}
                  commentHandlers={commentHandlers}
                  currentUser={user}
                />
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