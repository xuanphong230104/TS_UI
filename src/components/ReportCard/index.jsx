import React from 'react';
import { Tag, Dropdown, Divider } from 'antd';
import { 
  MessageOutlined, 
  SettingOutlined, 
  UserOutlined, 
  SwapOutlined, 
  CheckSquareOutlined 
} from '@ant-design/icons';
import RichTextEditor from '../RichTextEditor';
import CommentSection from '../CommentSection';
import UserAvatar from '../UserAvatar';
import TaskProgressList from '../TaskProgressList';
import AssociatedCheckIn from '../AssociatedCheckIn';


const ReportCard = ({
  report,
  formatTimeDiff,
  commentVisibleMap,
  toggleCommentSection,
  getCommentCount,
  commentHandlers,
  currentUser,
  showCheckInsMap,
  toggleCheckInsSection,
  prefixedId, // New prop to handle prefixed IDs
}) => {
  const { 
    id, 
    created_by, 
    created_at, 
    content, 
    tasks = [], 
    comments = [], 
    check_in 
  } = report;

  const {
    onReplyClick,
    replyToMap,
    onCancelReply,
    newCommentMap,
    onCommentChange,
    onKeyPress,
    onSubmitComment,
    isSubmittingComment,
  } = commentHandlers;

  // Use the prefixed ID if available
  const itemId = prefixedId || id;

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="avatar">
          <UserAvatar username={created_by?.username} />
        </div>
        <div className="post-info">
          <p className="post-author">
            {created_by?.username?.toUpperCase() || 'UNKNOWN USER'}
          </p>
          <p className="post-time">
            {formatTimeDiff(created_at)}
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
            initValue={content}
            readOnly={true}
          />
          
          {/* Task section */}
          {tasks.length > 0 && (
            <div className="tasks-section">
              <Divider orientation="left">
                <CheckSquareOutlined /> Tasks ({tasks.length})
              </Divider>
              <TaskProgressList tasks={tasks} />
            </div>
          )}
        </div>
        
        <div className="post-footer">
          <div
            className={`comment-section ${commentVisibleMap[itemId] ? 'active' : ''}`}
            onClick={toggleCommentSection}
          >
            <MessageOutlined />
            <span>{getCommentCount(comments)} comments</span>
          </div>
          
          <div
            className={`comment-section ${showCheckInsMap[itemId] ? 'active' : ''}`}
            onClick={toggleCheckInsSection}
          >
            <SwapOutlined />
            <span>Show Check-in</span>
          </div>
        </div>

        {showCheckInsMap[itemId] && (
          <AssociatedCheckIn 
            checkIn={check_in} 
            reportTasks={tasks}
            formatTimeDiff={formatTimeDiff}
          />
        )}

        {commentVisibleMap[itemId] && (
          <CommentSection
            comments={comments}
            checkInId={itemId}
            formatTimeDiff={formatTimeDiff}
            onReplyClick={onReplyClick}
            replyToMap={replyToMap}
            onCancelReply={onCancelReply}
            newCommentMap={newCommentMap}
            onCommentChange={onCommentChange}
            onKeyPress={onKeyPress}
            onSubmitComment={onSubmitComment}
            isSubmittingComment={isSubmittingComment}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default ReportCard;