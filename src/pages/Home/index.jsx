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
import TimeHeader from "../../components/TimeHeader";
import CheckInCard from "../../components/CheckInCard";
import ReportCard from "../../components/ReportCard";
import { formatTimeDiff, groupItemsByDate } from "../../utils/dateUtils";
import { updateNestedComments, getCommentCount } from "../../utils/commentUtils";

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

// Prefix constants to avoid ID collisions
const CHECKIN_PREFIX = "checkin_";
const REPORT_PREFIX = "report_";

const Home = (props) => {
  const { authentication } = props;
  const { user } = authentication;
  const [projectTabsKey, setProjectsTabKey] = useState("allUpdates");
  const [commentVisibleMap, setCommentVisibleMap] = useState({});
  const [newCommentMap, setNewCommentMap] = useState({});
  const [replyToMap, setReplyToMap] = useState({}); // Track which comment we're replying to
  const [checkIns, setCheckIns] = useState([]);
  const [reports, setReports] = useState([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState({});
  const [showCheckInsMap, setShowCheckInsMap] = useState({});
  const [loading, setLoading] = useState({
    checkIns: false,
    reports: false
  });
  const { teamId } = useParams();

  const onProjectsTabChange = (key) => {
    setProjectsTabKey(key);
  };

  // Create prefixed IDs to avoid collisions
  const getCheckInId = (id) => `${CHECKIN_PREFIX}${id}`;
  const getReportId = (id) => `${REPORT_PREFIX}${id}`;
  
  // Extract original ID from prefixed ID
  const getOriginalId = (prefixedId) => {
    if (prefixedId?.startsWith(CHECKIN_PREFIX)) {
      return prefixedId.replace(CHECKIN_PREFIX, "");
    }
    if (prefixedId?.startsWith(REPORT_PREFIX)) {
      return prefixedId.replace(REPORT_PREFIX, "");
    }
    return prefixedId; // Fallback
  };

  // Comment handlers
  const toggleCommentSection = (prefixedId) => {
    setCommentVisibleMap((prev) => ({
      ...prev,
      [prefixedId]: !prev[prefixedId],
    }));
  };

  // Check-in handler
  const toggleCheckInsSection = (prefixedId) => {
    setShowCheckInsMap(prev => ({
      ...prev,
      [prefixedId]: !prev[prefixedId]
    }));
  };

  const handleCommentChange = (prefixedId, e) => {
    setNewCommentMap((prev) => ({
      ...prev,
      [prefixedId]: e.target.value,
    }));
  };

  const handleReplyClick = (prefixedId, commentId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [prefixedId]: commentId,
    }));
  };

  const handleCancelReply = (prefixedId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [prefixedId]: null,
    }));
    setNewCommentMap((prev) => ({
      ...prev,
      [prefixedId]: "",
    }));
  };

  const handleKeyPress = (prefixedId, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(prefixedId);
    }
  };

  // Helper to determine if prefixed ID belongs to check-in or report
  const getContentType = (prefixedId) => {
    if (prefixedId?.startsWith(CHECKIN_PREFIX)) {
      return "checkin";
    }
    if (prefixedId?.startsWith(REPORT_PREFIX)) {
      return "report";
    }
    return "checkin"; // Default fallback
  };

  const handleSubmitComment = async (prefixedId) => {
    const newComment = newCommentMap[prefixedId];
    if (!newComment || newComment.trim() === "") return;

    setIsSubmittingComment((prev) => ({ ...prev, [prefixedId]: true }));

    try {
      const originalId = getOriginalId(prefixedId);
      const contentType = getContentType(prefixedId);
      
      const commentData = {
        team_id: teamId,
        content: newComment,
        content_type: contentType,
        object_id: originalId,
        parent_id: replyToMap[prefixedId] || null,
      };

      const response = await axiosClient.post(API_ENDPOINTS.COMMENT, commentData);
      const newCommentFromServer = response.data;

      // Update the appropriate state based on content type
      if (contentType === "checkin") {
        updateCheckInComments(originalId, prefixedId, newCommentFromServer);
      } else if (contentType === "report") {
        updateReportComments(originalId, prefixedId, newCommentFromServer);
      }

      // Clear input and reply state
      setNewCommentMap((prev) => ({
        ...prev,
        [prefixedId]: "",
      }));
      setReplyToMap((prev) => ({
        ...prev,
        [prefixedId]: null,
      }));
    } catch (error) {
      console.error(`Error submitting comment:`, error);
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [prefixedId]: false }));
    }
  };

  const updateCheckInComments = (checkInId, prefixedId, newCommentFromServer) => {
    setCheckIns((prevCheckIns) => {
      return prevCheckIns.map((checkIn) => {
        if (checkIn.id === checkInId) {
          if (replyToMap[prefixedId]) {
            // Add as a reply to existing comment
            return {
              ...checkIn,
              comments: updateNestedComments(
                checkIn.comments, 
                replyToMap[prefixedId], 
                newCommentFromServer
              )
            };
          } else {
            // Add as a new top-level comment
            return {
              ...checkIn,
              comments: [...(checkIn.comments || []), newCommentFromServer],
            };
          }
        }
        return checkIn;
      });
    });
  };

  const updateReportComments = (reportId, prefixedId, newCommentFromServer) => {
    setReports((prevReports) => {
      return prevReports.map((report) => {
        if (report.id === reportId) {
          if (replyToMap[prefixedId]) {
            // Add as a reply to existing comment
            return {
              ...report,
              comments: updateNestedComments(
                report.comments, 
                replyToMap[prefixedId], 
                newCommentFromServer
              )
            };
          } else {
            // Add as a new top-level comment
            return {
              ...report,
              comments: [...(report.comments || []), newCommentFromServer],
            };
          }
        }
        return report;
      });
    });
  };

  // Data fetching
  useEffect(() => {
    if (projectTabsKey === "allUpdates" || projectTabsKey === "checkIns") {
      loadCheckIns();
    }
    
    if (projectTabsKey === "allUpdates" || projectTabsKey === "reports") {
      loadReports();
    }
  }, [teamId, projectTabsKey]);

  const loadCheckIns = async () => {
    setLoading(prev => ({ ...prev, checkIns: true }));
    try {
      const response = await axiosClient.get(API_ENDPOINTS.CHECKIN, { 
        params: { team: teamId } 
      });
      setCheckIns(response.data.data || []);
    } catch (error) {
      console.error("Error fetching check-ins:", error);
    } finally {
      setLoading(prev => ({ ...prev, checkIns: false }));
    }
  };

  const loadReports = async () => {
    setLoading(prev => ({ ...prev, reports: true }));
    try {
      const response = await axiosClient.get(API_ENDPOINTS.REPORT, { 
        params: { team: teamId } 
      });
      setReports(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(prev => ({ ...prev, reports: false }));
    }
  };

  // Filter content based on current tab
  const filterContentByTab = (items) => {
    if (projectTabsKey === "allUpdates") return items;
    return items;
  };

  // Group items by date
  const groupItemsByDateCustom = (items) => {
    const grouped = {};
    const filteredItems = filterContentByTab(items);

    filteredItems.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      const weekday = new Date(item.created_at).toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (!grouped[date]) {
        grouped[date] = {
          weekday,
          items: [],
        };
      }
      grouped[date].items.push(item);
    });
    return grouped;
  };

  // Check-in comment handlers
  const checkInCommentHandlers = {
    onReplyClick: handleReplyClick,
    replyToMap,
    onCancelReply: handleCancelReply,
    newCommentMap,
    onCommentChange: handleCommentChange,
    onKeyPress: handleKeyPress,
    onSubmitComment: handleSubmitComment,
    isSubmittingComment,
  };

  // Report comment handlers
  const reportCommentHandlers = {
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
    if (loading.checkIns) {
      return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
    }

    if (checkIns.length === 0) {
      return <Empty description="No check-ins found" />;
    }

    return (
      <div className="updates-container">
        {Object.entries(groupItemsByDateCustom(checkIns)).map(
          ([date, { weekday, items: groupedCheckIns }]) => (
            <div key={date}>
              <TimeHeader weekday={weekday} date={date} />

              {groupedCheckIns.map((checkIn) => {
                const prefixedId = getCheckInId(checkIn.id);
                return (
                  <CheckInCard
                    key={checkIn.id}
                    checkIn={checkIn}
                    formatTimeDiff={formatTimeDiff}
                    commentVisibleMap={commentVisibleMap}
                    toggleCommentSection={() => toggleCommentSection(prefixedId)}
                    getCommentCount={getCommentCount}
                    commentHandlers={{
                      ...checkInCommentHandlers,
                      // Override handlers with prefixed ID
                      onReplyClick: (_, commentId) => handleReplyClick(prefixedId, commentId),
                      onCancelReply: () => handleCancelReply(prefixedId),
                      onCommentChange: (e) => handleCommentChange(prefixedId, e),
                      onKeyPress: (e) => handleKeyPress(prefixedId, e),
                      onSubmitComment: () => handleSubmitComment(prefixedId),
                    }}
                    currentUser={user}
                    prefixedId={prefixedId}
                  />
                );
              })}
            </div>
          )
        )}
      </div>
    );
  };

  const renderReportContent = () => {
    if (loading.reports) {
      return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
    }

    if (reports.length === 0) {
      return <Empty description="No reports found" />;
    }

    return (
      <div className="reports-container">
        {Object.entries(groupItemsByDateCustom(reports)).map(
          ([date, { weekday, items: groupedReports }]) => (
            <div key={date}>
              <TimeHeader weekday={weekday} date={date} />

              {groupedReports.map((report) => {
                const prefixedId = getReportId(report.id);
                return (
                  <ReportCard
                    key={report.id}
                    report={report}
                    formatTimeDiff={formatTimeDiff}
                    commentVisibleMap={commentVisibleMap}
                    toggleCommentSection={() => toggleCommentSection(prefixedId)}
                    showCheckInsMap={showCheckInsMap}
                    toggleCheckInsSection={() => toggleCheckInsSection(prefixedId)}
                    getCommentCount={getCommentCount}
                    commentHandlers={{
                      ...reportCommentHandlers,
                      // Override handlers with prefixed ID
                      onReplyClick: (_, commentId) => handleReplyClick(prefixedId, commentId),
                      onCancelReply: () => handleCancelReply(prefixedId),
                      onCommentChange: (e) => handleCommentChange(prefixedId, e),
                      onKeyPress: (e) => handleKeyPress(prefixedId, e),
                      onSubmitComment: () => handleSubmitComment(prefixedId),
                    }}
                    currentUser={user}
                    prefixedId={prefixedId}
                  />
                );
              })}
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
            {projectTabsKey === "reports" ? (
              renderReportContent()
            ) : projectTabsKey === "allUpdates" ? (
              <div>
                {renderCheckInContent()}
                {renderReportContent()}
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