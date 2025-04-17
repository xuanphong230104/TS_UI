import PropTypes from "prop-types";
import { Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { API_ENDPOINTS } from "../../constants";
import axiosClient from "../../helpers/axiosClient";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import DayGroup from "../../components/DayGroup";
import { formatTimeDiff, getCommentCount } from "../../utils/dateUtils";
import useComments from "../../hooks/useComments";


const PROJECT_TABS = [
  {
    key: "checkIn",
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
  const [projectTabsKey, setProjectsTabKey] = useState("checkIn");
  const [checkIns, setCheckIns] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckInsMap, setShowCheckInsMap] = useState({});
  const { teamId } = useParams();

  // Use the custom comments hook
  const {
    commentVisibleMap,
    newCommentMap,
    replyToMap,
    isSubmittingComment,
    toggleCommentSection,
    handleCommentChange,
    handleReplyClick,
    handleCancelReply,
    handleSubmitComment,
    handleKeyPress,
  } = useComments(teamId, projectTabsKey === "checkIn" ? "checkin" : "report");

  const onProjectsTabChange = (key) => {
    setProjectsTabKey(key);
  };

  // Wrapper functions to pass the setCheckIns function to the hook
  const handleSubmitCommentWrapper = (itemId) => {
    // Determine which setter function to use based on the active tab
    if (projectTabsKey === "checkIn") {
      handleSubmitComment(itemId, setCheckIns);
    } else if (projectTabsKey === "reports") {
      handleSubmitComment(itemId, setReport);
    }
  };

  const handleKeyPressWrapper = (itemId, e) => {
    // Determine which setter function to use based on the active tab
    if (projectTabsKey === "checkIn") {
      handleKeyPress(itemId, e, setCheckIns);
    } else if (projectTabsKey === "reports") {
      handleKeyPress(itemId, e, setReport);
    }
  };

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(API_ENDPOINTS.CHECKIN, {
        params: { team: teamId },
      });
      const data = res.data.data || [];
      setCheckIns(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(API_ENDPOINTS.REPORT, {
        params: { team: teamId },
      });
      const data = res.data.data || [];
      setReport(data);
      //test
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectTabsKey === "checkIn") {
      fetchCheckIns();
    } else if (projectTabsKey === "reports") {
      fetchReports();
    }
  }, [teamId, isSubmittingComment, projectTabsKey]);

  const toggleCheckInsSection = (itemId) => {
    setShowCheckInsMap(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Function to group check-ins and reports by date
  const groupItemsByDate = (items, tabKey) => {
    const grouped = {};

    // No need to filter items as they are already fetched based on the tab
    items.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
      const weekday = new Date(item.created_at).toLocaleDateString("en-US", {
        weekday: "long",
      });

      // Initialize the group for this date if it doesn't exist yet
      if (!grouped[date]) {
        grouped[date] = {
          weekday,
          checkIns: tabKey === "checkIn" ? [] : undefined,
          reports: tabKey === "reports" ? [] : undefined,
        };
      }

      // Add the item to the appropriate array based on the current tab
      if (tabKey === "checkIn") {
        grouped[date].checkIns.push(item);
      } else if (tabKey === "reports") {
        grouped[date].reports.push(item);
      }
    });

    return grouped;
  };
  console.log(report);

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
              {loading && (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Spin size="large" />
                </div>
              )}
              {projectTabsKey === "checkIn" &&
                Object.entries(groupItemsByDate(checkIns, projectTabsKey)).map(
                  ([date, { weekday, checkIns: groupedItems }]) => (
                    <DayGroup
                      key={date}
                      date={date}
                      weekday={weekday}
                      groupedItems={groupedItems}
                      itemType="checkIn"
                      formatTimeDiff={formatTimeDiff}
                      commentVisibleMap={commentVisibleMap}
                      toggleCommentSection={toggleCommentSection}
                      getCommentCount={getCommentCount}
                      onReplyClick={handleReplyClick}
                      replyToMap={replyToMap}
                      newCommentMap={newCommentMap}
                      isSubmittingComment={isSubmittingComment}
                      handleCommentChange={handleCommentChange}
                      handleKeyPress={handleKeyPressWrapper}
                      handleSubmitComment={handleSubmitCommentWrapper}
                      handleCancelReply={handleCancelReply}
                      currentUsername={user?.username}
                    />
                  )
                )}
              {projectTabsKey === "reports" &&
                Object.entries(groupItemsByDate(report, projectTabsKey)).map(
                  ([date, { weekday, reports: groupedItems }]) => (
                    <DayGroup
                      key={date}
                      date={date}
                      weekday={weekday}
                      groupedItems={groupedItems}
                      itemType="reports"
                      formatTimeDiff={formatTimeDiff}
                      commentVisibleMap={commentVisibleMap}
                      toggleCommentSection={toggleCommentSection}
                      getCommentCount={getCommentCount}
                      onReplyClick={handleReplyClick}
                      replyToMap={replyToMap}
                      newCommentMap={newCommentMap}
                      isSubmittingComment={isSubmittingComment}
                      handleCommentChange={handleCommentChange}
                      handleKeyPress={handleKeyPressWrapper}
                      handleSubmitComment={handleSubmitCommentWrapper}
                      handleCancelReply={handleCancelReply}
                      currentUsername={user?.username}
                      showCheckInsMap={showCheckInsMap}
                      toggleCheckInsSection={toggleCheckInsSection}
                    />
                  )
                )}
            </div>
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

Home.propTypes = {
  authentication: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Home);
