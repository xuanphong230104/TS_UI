import React from 'react';
import { Dropdown, Tag } from 'antd';
import { MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import UserAvatar from '../UserAvatar';
import RichTextEditor from '../RichTextEditor';
import CommentSection from '../CommentSection';


const CheckInCard = ({
  checkIn,
  formatTimeDiff,
  commentVisibleMap,
  toggleCommentSection,
  getCommentCount,
  commentHandlers,
  currentUser,
}) => {
  const {
    id,
    created_by,
    created_at,
    content,
    object,
    comments = [],
  } = checkIn;

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
            className={`comment-section ${commentVisibleMap[id] ? 'active' : ''}`}
            onClick={() => toggleCommentSection(id)}
          >
            <MessageOutlined />
            <span>{getCommentCount(comments)} comments</span>
          </div>
        </div>

        {commentVisibleMap[id] && (
          <CommentSection
            comments={comments}
            checkInId={id}
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

export default CheckInCard;