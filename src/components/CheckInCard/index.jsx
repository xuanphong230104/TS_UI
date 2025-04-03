import React from 'react';
import { Dropdown, Tag } from 'antd';
import { MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import UserAvatar from '../UserAvatar';
import RichTextEditor from '../RichTextEditor';
import CommentSection from '../CommentSection';
import './index.scss';

const CheckInCard = ({
  checkIn,
  formatTimeDiff,
  commentVisibleMap,
  toggleCommentSection,
  getCommentCount,
  commentHandlers,
  currentUser,
  prefixedId, // New prop to handle prefixed IDs
}) => {
  const {
    id,
    created_by,
    created_at,
    content,
    object,
    comments = [],
  } = checkIn;

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
            <Tag color="green" style={{ marginLeft: 8 }}>Check-in</Tag>
          </p>
        </div>
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Edit',
                icon: <SettingOutlined />,
              },
              {
                key: 'view-detail',
                label: 'View Detail',
                icon: <UserOutlined />,
              },
            ],
          }}
          trigger={['click']}
        >
          <div className="post-menu">...</div>
        </Dropdown>
      </div>

      <div className="post-content">
        <div className="post-section">
          <RichTextEditor
            initValue={object?.content || content}
            readOnly={true}
          />
        </div>
        <div className="post-footer">
          <div
            className={`comment-section ${commentVisibleMap[itemId] ? 'active' : ''}`}
            onClick={toggleCommentSection}
          >
            <MessageOutlined />
            <span>{getCommentCount(comments)} comments</span>
          </div>
        </div>

        {commentVisibleMap[itemId] && (
          <CommentSection
            comments={comments}
            checkInId={itemId}
            formatTimeDiff={formatTimeDiff}
            onReplyClick={commentHandlers.onReplyClick}
            replyToMap={commentHandlers.replyToMap}
            onCancelReply={commentHandlers.onCancelReply}
            newCommentMap={commentHandlers.newCommentMap}
            onCommentChange={commentHandlers.onCommentChange}
            onKeyPress={commentHandlers.onKeyPress}
            onSubmitComment={commentHandlers.onSubmitComment}
            isSubmittingComment={commentHandlers.isSubmittingComment}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default CheckInCard;