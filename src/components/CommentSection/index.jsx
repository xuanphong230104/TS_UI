import React from 'react';
import { List } from 'antd';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { sortComments } from '../../utils/commentUtils';
import { formatTimeDiff } from '../../utils/dateUtils';

const CommentSection = ({
  comments = [],
  checkInId,
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
            onReplyClick={onReplyClick}
            replyToId={replyToMap[checkInId]}
            onCancelReply={onCancelReply}
            newCommentValue={newCommentMap[checkInId] || ''}
            onCommentChange={onCommentChange}
            onKeyPress={onKeyPress}
            onSubmitComment={onSubmitComment}
            isSubmittingComment={isSubmittingComment[checkInId]}
            currentUser={currentUser}
          />
        )}
      />

      {!replyToMap[checkInId] && (
        <CommentInput
          username={currentUser?.username}
          value={newCommentMap[checkInId] || ''}
          onChange={(e) => onCommentChange(checkInId, e)}
          onKeyDown={(e) => onKeyPress(checkInId, e)}
          onSubmit={() => onSubmitComment(checkInId)}
          isSubmitting={isSubmittingComment[checkInId]}
        />
      )}
    </div>
  );
};

export default CommentSection;