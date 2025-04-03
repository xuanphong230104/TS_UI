import React from 'react';
import { List } from 'antd';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { sortComments } from '../../utils/commentUtils';

const CommentSection = ({
  comments = [],
  checkInId,
  formatTimeDiff,
  onReplyClick,
  replyToMap,
  onCancelReply,
  newCommentMap,
  onCommentChange,
  onKeyPress,
  onSubmitComment,
  isSubmittingComment,
  currentUser,
}) => {
  // Sort comments by date (oldest to newest)
  const sortedComments = sortComments(comments);

  // Get correct values for this specific item
  const isReplyingToComment = replyToMap[checkInId];
  const commentValue = newCommentMap[checkInId] || '';
  const isSubmitting = isSubmittingComment[checkInId];

  return (
    <div className="comments-container">
      <List
        itemLayout="horizontal"
        dataSource={sortedComments}
        className="comments-list"
        renderItem={(comment) => (
          <CommentItem
            comment={comment}
            checkInId={checkInId}
            formatTimeDiff={formatTimeDiff}
            onReplyClick={(_, commentId) => onReplyClick(checkInId, commentId)}
            replyToId={isReplyingToComment}
            onCancelReply={() => onCancelReply(checkInId)}
            newCommentValue={commentValue}
            onCommentChange={onCommentChange}
            onKeyPress={onKeyPress}
            onSubmitComment={onSubmitComment}
            isSubmittingComment={isSubmitting}
            currentUser={currentUser}
          />
        )}
      />

      {!isReplyingToComment && (
        <CommentInput
          username={currentUser?.username}
          value={commentValue}
          onChange={onCommentChange}
          onKeyDown={onKeyPress}
          onSubmit={onSubmitComment}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default CommentSection;