import { useState } from "react";

// Pure CSS (no SCSS needed)
const styles = `
  .dashboard {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    max-width: 100%;
    margin: 0 auto;
  }

  .tab-container {
    display: flex;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }

  .tab {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }

  .tab.active {
    border-bottom: 2px solid #0a2647;
    color: #0a2647;
  }

  .date-section {
    margin-bottom: 20px;
  }

  .date-header {
    padding: 16px 48px;
    border-bottom: 1px solid #f4f4f6;
  }

  .date-name {
    display: block;
    margin-top: 1px;
    margin-bottom: -4px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .date-value {
    font-size: 28px;
    font-weight: 700;
  }

  .activity-card {
    border-bottom: 1px solid #f4f4f6;
    padding: 16px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #0a2647;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  }

  .user-info {
    flex-grow: 1;
  }

  .user-name {
    font-weight: 600;
    font-size: 14px;
    margin: 0;
    color: #333;
  }

  .activity-time {
    color: #6b7280;
    font-size: 12px;
    margin: 0;
  }

  .activity-type {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
  }

  .activity-type.checkin {
    background-color: #e3f1fd;
    color: #4a90e2;
  }

  .activity-type.report {
    background-color: #e6f7ee;
    color: #0fbd71;
  }

  .menu-dots {
    color: #6b7280;
    font-size: 20px;
    cursor: pointer;
  }

  .card-content {
    margin-left: 52px;
  }

  .content-section {
    margin-bottom: 12px;
    border-left: 3px solid #d0d2dc;
    padding-left: 12px;
  }

  .section-label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .section-text {
    font-size: 14px;
    color: #333;
    margin: 0;
  }

  .task-list {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #eee;
  }

  .task-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .task-checkbox {
    margin-right: 8px;
    margin-top: 3px;
  }

  .task-done {
    text-decoration: line-through;
    color: #6b7280;
  }

  .card-footer {
    display: flex;
    margin-left: 52px;
    margin-top: 16px;
    align-items: center;
    gap: 16px;
  }

  .comment-button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    font-size: 13px;
    cursor: pointer;
  }

  .comment-button:hover {
    color: #0a2647;
  }

  .comment-section {
    margin-top: 12px;
    margin-left: 52px;
    padding-top: 12px;
    border-top: 1px solid #f4f4f6;
  }

  .comment-list {
    margin-bottom: 12px;
  }

  .comment-item {
    display: flex;
    margin-bottom: 12px;
  }

  .comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #6b7280;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    margin-right: 12px;
  }

  .comment-content {
    background-color: #f4f4f6;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 14px;
    flex-grow: 1;
  }

  .comment-author {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .comment-input-container {
    display: flex;
    margin-bottom: 12px;
  }

  .comment-input {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 18px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
  }

  .comment-input:focus {
    border-color: #0a2647;
  }

  .send-button {
    margin-left: 8px;
    background-color: #0a2647;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-button:hover {
    background-color: #083158;
  }
`;

const Home = () => {
  const [activeTab, setActiveTab] = useState("allUpdates");
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Sample activity data
  const activitiesData = [
    {
      id: 1,
      date: { day: "Wednesday", fullDate: "February 28, 2025" },
      activities: [
        {
          id: 101,
          type: "checkin",
          user: { name: "NGUYEN PHONG", initials: "NP" },
          time: "2 hours ago",
          content: {
            blockers: "Waiting for design approval from client",
            next: "Continue testing on Design on Figma",
            previously: "Continued on designing UI components",
          },
          tasks: [],
          comments: [
            {
              id: 1001,
              user: { name: "Sarah Lee", initials: "SL" },
              text: "Can I help with anything while you wait for approval?",
            },
          ],
        },
        {
          id: 102,
          type: "report",
          user: { name: "MICHAEL CHEN", initials: "MC" },
          time: "4 hours ago",
          content: {
            summary: "Completed the API integration for the user dashboard",
            achievements: "Fixed 3 critical bugs in the authentication flow",
            challenges: "Database performance issue with large datasets",
          },
          tasks: [
            { id: 201, text: "Fix login redirect issue", completed: true },
            { id: 202, text: "Implement error handling", completed: true },
            { id: 203, text: "Optimize database queries", completed: false },
          ],
          comments: [],
        },
      ],
    },
    {
      id: 2,
      date: { day: "Tuesday", fullDate: "February 27, 2025" },
      activities: [
        {
          id: 103,
          type: "checkin",
          user: { name: "EMMA WATSON", initials: "EW" },
          time: "1 day ago",
          content: {
            blockers: null,
            next: "Begin implementation of dashboard charts",
            previously: "Set up the project architecture",
          },
          tasks: [],
          comments: [],
        },
        {
          id: 104,
          type: "report",
          user: { name: "JAMES RODRIGUEZ", initials: "JR" },
          time: "1 day ago",
          content: {
            summary: "Completed user research and competitive analysis",
            achievements: "Identified key user pain points",
            challenges: null,
          },
          tasks: [
            { id: 204, text: "Conduct user interviews", completed: true },
            {
              id: 205,
              text: "Create research summary document",
              completed: true,
            },
          ],
          comments: [
            {
              id: 1002,
              user: { name: "NGUYEN PHONG", initials: "NP" },
              text: "Great work! The insights are really helpful.",
            },
            {
              id: 1003,
              user: { name: "EMMA WATSON", initials: "EW" },
              text: "Can you share the raw interview data?",
            },
          ],
        },
      ],
    },
  ];

  // Filter activities based on active tab
  const getFilteredActivities = () => {
    if (activeTab === "allUpdates") {
      return activitiesData;
    } else {
      return activitiesData
        .map((dateGroup) => ({
          ...dateGroup,
          activities: dateGroup.activities.filter(
            (activity) =>
              activity.type ===
              (activeTab === "checkIns" ? "checkin" : "report"),
          ),
        }))
        .filter((dateGroup) => dateGroup.activities.length > 0);
    }
  };

  // Toggle comment section for an activity
  const toggleComments = (activityId) => {
    setOpenComments({
      ...openComments,
      [activityId]: !openComments[activityId],
    });
  };

  // Handle comment input change
  const handleCommentInputChange = (activityId, value) => {
    setCommentInputs({
      ...commentInputs,
      [activityId]: value,
    });
  };

  // Add a new comment
  const addComment = (activityId) => {
    if (!commentInputs[activityId] || commentInputs[activityId].trim() === "")
      return;

    // In a real application, you would send this to an API
    alert(
      `Comment added to activity ${activityId}: ${commentInputs[activityId]}`,
    );

    // Clear the input
    setCommentInputs({
      ...commentInputs,
      [activityId]: "",
    });
  };

  // Render a single activity card
  const renderActivityCard = (activity) => {
    return (
      <div className="activity-card" key={activity.id}>
        <div className="card-header">
          <div className="avatar">{activity.user.initials}</div>
          <div className="user-info">
            <p className="user-name">{activity.user.name}</p>
            <p className="activity-time">
              {activity.time}
              <span className={`activity-type ${activity.type}`}>
                {activity.type === "checkin" ? "Check-in" : "Report"}
              </span>
            </p>
          </div>
          <div className="menu-dots">...</div>
        </div>

        <div className="card-content">
          {/* Display content sections based on activity type */}
          {activity.type === "checkin" ? (
            // Check-in content
            <>
              {activity.content.blockers && (
                <div className="content-section">
                  <div className="section-label">Blockers</div>
                  <p className="section-text">{activity.content.blockers}</p>
                </div>
              )}
              {activity.content.next && (
                <div className="content-section">
                  <div className="section-label">Next</div>
                  <p className="section-text">{activity.content.next}</p>
                </div>
              )}
              {activity.content.previously && (
                <div className="content-section">
                  <div className="section-label">Previously</div>
                  <p className="section-text">{activity.content.previously}</p>
                </div>
              )}
            </>
          ) : (
            // Report content
            <>
              {activity.content.summary && (
                <div className="content-section">
                  <div className="section-label">Summary</div>
                  <p className="section-text">{activity.content.summary}</p>
                </div>
              )}
              {activity.content.achievements && (
                <div className="content-section">
                  <div className="section-label">Achievements</div>
                  <p className="section-text">
                    {activity.content.achievements}
                  </p>
                </div>
              )}
              {activity.content.challenges && (
                <div className="content-section">
                  <div className="section-label">Challenges</div>
                  <p className="section-text">{activity.content.challenges}</p>
                </div>
              )}

              {/* Task list for reports */}
              {activity.tasks.length > 0 && (
                <div className="task-list">
                  <div className="section-label">Tasks</div>
                  {activity.tasks.map((task) => (
                    <div className="task-item" key={task.id}>
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={task.completed}
                        readOnly
                      />
                      <span className={task.completed ? "task-done" : ""}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="card-footer">
          <div
            className="comment-button"
            onClick={() => toggleComments(activity.id)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>{activity.comments.length} Comments</span>
          </div>
        </div>

        {/* Comment section */}
        {openComments[activity.id] && (
          <div className="comment-section">
            <div className="comment-list">
              {activity.comments.map((comment) => (
                <div className="comment-item" key={comment.id}>
                  <div className="comment-avatar">{comment.user.initials}</div>
                  <div className="comment-content">
                    <div className="comment-author">{comment.user.name}</div>
                    <div>{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="comment-input-container">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentInputs[activity.id] || ""}
                onChange={(e) =>
                  handleCommentInputChange(activity.id, e.target.value)
                }
                onKeyPress={(e) => e.key === "Enter" && addComment(activity.id)}
              />
              <button
                className="send-button"
                onClick={() => addComment(activity.id)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a date group with all its activities
  const renderDateGroup = (dateGroup) => {
    return (
      <div className="date-section" key={dateGroup.id}>
        <div className="date-header">
          <div className="date-name">{dateGroup.date.day}</div>
          <div className="date-value">{dateGroup.date.fullDate}</div>
        </div>
        {dateGroup.activities.map((activity) => renderActivityCard(activity))}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <style>{styles}</style>

      <div className="tab-container">
        <div
          className={`tab ${activeTab === "allUpdates" ? "active" : ""}`}
          onClick={() => setActiveTab("allUpdates")}
        >
          All Updates
        </div>
        <div
          className={`tab ${activeTab === "checkIns" ? "active" : ""}`}
          onClick={() => setActiveTab("checkIns")}
        >
          Check-ins
        </div>
        <div
          className={`tab ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </div>
      </div>

      {getFilteredActivities().map((dateGroup) => renderDateGroup(dateGroup))}
    </div>
  );
};

export default Home;
