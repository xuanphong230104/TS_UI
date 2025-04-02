import React from 'react';
import { List, Button } from 'antd';
import UserAvatar from '../UserAvatar';
import CommentInput from './CommentInput';
import { formatTimeDiff } from '../../utils/dateUtils';

const CommentItem = ({
  comment,
  checkInId,
  level = 0,
  formatTimeDiff,
  onReplyClick,
  replyToId,
  onCancelReply,
  newCommentValue,
  onCommentChange,
  onKeyPress,
  onSubmitComment,
  isSubmittingComment,
  currentUser,
}) => {
  const { id, created_by, content, created_at, children = [] } = comment;
  
  return (
    <div key={id} style={{ marginLeft: level * 24 }}>
      <List.Item className="comment-item">
        <div className="comment-avatar">
          <UserAvatar username={created_by?.username} />
        </div>
        <div className="comment-content">
          <div className="comment-author">
            {created_by?.username || 'Unknown User'}
          </div>
          <div className="comment-text">{content}</div>
          <div className="comment-footer">
            <span className="comment-time">
              {formatTimeDiff(created_at)}
            </span>
            <Button
              type="link"
              onClick={() => onReplyClick(checkInId, id)}
            >
              Reply
            </Button>
          </div>
        </div>
      </List.Item>

      {children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          checkInId={checkInId}
          level={level + 1}
          formatTimeDiff={formatTimeDiff}
          onReplyClick={onReplyClick}
          replyToId={replyToId}
          onCancelReply={onCancelReply}
          newCommentValue={newCommentValue}
          onCommentChange={onCommentChange}
          onKeyPress={onKeyPress}
          onSubmitComment={onSubmitComment}
          isSubmittingComment={isSubmittingComment}
          currentUser={currentUser}
        />
      ))}

      {replyToId === id && (
        <div className="reply-input" style={{ marginLeft: (level + 1) * 24 }}>
          <CommentInput
            username={currentUser?.username}
            value={newCommentValue}
            onChange={(e) => onCommentChange(checkInId, e)}
            onKeyDown={(e) => onKeyPress(checkInId, e)}
            onSubmit={() => onSubmitComment(checkInId)}
            isSubmitting={isSubmittingComment}
            placeholder="Write a reply..."
            showCancelButton={true}
            onCancel={() => onCancelReply(checkInId)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;