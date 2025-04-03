import React from 'react';
import { Divider } from 'antd';
import { CalendarOutlined, SyncOutlined } from '@ant-design/icons';
import RichTextEditor from '../RichTextEditor';
import TaskProgressList from '../TaskProgressList';
import UserAvatar from '../UserAvatar';
import { formatTimeDiff } from '../../utils/dateUtils';
import './index.scss';

const AssociatedCheckIn = ({ checkIn, reportTasks, formatTimeDiff }) => {
  if (!checkIn) {
    return (
      <div className="checkin-comparison">
        <Divider orientation="left">
          <CalendarOutlined /> Associated Check-in
        </Divider>
        <div className="no-checkin">No associated check-in found</div>
      </div>
    );
  }

  const showTaskComparison = 
    reportTasks && 
    reportTasks.length > 0 && 
    checkIn.tasks && 
    checkIn.tasks.length > 0;

  return (
    <div className="checkin-comparison">
      <Divider orientation="left">
        <CalendarOutlined /> Associated Check-in
      </Divider>
      <div className="checkin-content">
        <div className="checkin-header">
          <UserAvatar 
            username={checkIn.created_by?.username} 
            size="small" 
          />
          <span className="checkin-author">
            {checkIn.created_by?.username || 'Unknown'} · {formatTimeDiff(checkIn.created_at)}
          </span>
        </div>
        <div className="checkin-body">
          <RichTextEditor
            initValue={checkIn.content}
            readOnly={true}
          />
        </div>
        
        {/* Task comparison section */}
        {showTaskComparison && (
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
                  tasks={checkIn.tasks} 
                  compareMode={true} 
                />
              </div>
              
              <div className="comparison-column">
                <h4>Report Tasks</h4>
                <TaskProgressList 
                  tasks={reportTasks} 
                  compareMode={true} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociatedCheckIn;