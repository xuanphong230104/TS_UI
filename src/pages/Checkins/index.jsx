import { useState, useEffect } from "react";
import "./index.scss";

const Checkins = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - in a real app, this would come from an API
  const sampleCheckins = [
    {
      id: 1,
      userId: 101,
      userName: "Sarah Chen",
      date: "2025-02-28",
      content: "Working on the UI components for the dashboard.",
      tasks: [
        { id: 1, title: "Create chart components", type: "team", status: "In Progress" },
        { id: 2, title: "Review PRs", type: "personal", status: "Completed" },
      ],
      team: "Development Team"
    },
    {
      id: 2,
      userId: 102,
      userName: "Michael Rodriguez",
      date: "2025-02-28",
      content: "Finalizing the marketing materials for the product launch.",
      tasks: [
        { id: 3, title: "Prepare social media posts", type: "team", status: "Todo" },
        { id: 4, title: "Schedule team meeting", type: "personal", status: "Completed" },
      ],
      team: "Marketing Team"
    },
    {
      id: 3,
      userId: 101,
      userName: "Sarah Chen",
      date: "2025-02-27",
      content: "Focused on fixing bugs in the payment processing module.",
      tasks: [
        { id: 5, title: "Debug payment gateway issues", type: "team", status: "Completed" },
        { id: 6, title: "Update documentation", type: "personal", status: "Todo" },
      ],
      team: "Development Team"
    },
    {
      id: 4,
      userId: 103,
      userName: "Alex Johnson",
      date: "2025-02-27",
      content: "Working on the new logo variations and color palette.",
      tasks: [
        { id: 7, title: "Create logo mockups", type: "team", status: "In Progress" },
        { id: 8, title: "Research color trends", type: "personal", status: "Completed" },
      ],
      team: "Design Team"
    },
    {
      id: 5,
      userId: 104,
      userName: "Jamie Wilson",
      date: "2025-02-26",
      content: "Planning the sprint for next week and reviewing team progress.",
      tasks: [
        { id: 9, title: "Sprint Planning", type: "team", status: "Completed" },
        { id: 10, title: "One-on-one meetings", type: "personal", status: "In Progress" },
      ],
      team: "Development Team"
    }
  ];

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setCheckins(sampleCheckins);
      setLoading(false);
    }, 1000);
  }, []);

  // Group check-ins by date
  const groupedCheckins = checkins.reduce((groups, checkin) => {
    const date = checkin.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(checkin);
    return groups;
  }, {});

  // Convert to array and sort by date (most recent first)
  const sortedDates = Object.keys(groupedCheckins).sort().reverse();

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status class for coloring
  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-progress';
      default: return 'status-todo';
    }
  };

  return (
    <div className="check-in-container">
      <div className="check-in-card">
        <h1 className="page-title">Daily Check-ins</h1>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading check-ins...</p>
          </div>
        ) : (
          <div className="checkins-list">
            {sortedDates.map(date => (
              <div key={date} className="date-group">
                <h2 className="date-header">{formatDate(date)}</h2>
                
                {groupedCheckins[date].map(checkin => (
                  <div key={checkin.id} className="checkin-item">
                    <div className="checkin-header">
                      <div className="user-info">
                        <div className="user-avatar">{checkin.userName.charAt(0)}</div>
                        <h3 className="user-name">{checkin.userName}</h3>
                      </div>
                      <div className="team-badge">{checkin.team}</div>
                    </div>
                    
                    <div className="checkin-content">
                      <p>{checkin.content}</p>
                    </div>
                    
                    <div className="tasks-section">
                      <h4 className="tasks-header">Tasks:</h4>
                      <ul className="tasks-list">
                        {checkin.tasks.map(task => (
                          <li key={task.id} className="task-item">
                            <span className="task-title">{task.title}</span>
                            <div className="task-labels">
                              <span className={`task-type ${task.type === 'team' ? 'type-team' : 'type-personal'}`}>
                                {task.type}
                              </span>
                              <span className={`task-status ${getStatusClass(task.status)}`}>
                                {task.status}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkins;