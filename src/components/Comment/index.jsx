import PropTypes from "prop-types";
import { Button, List } from "antd";
import UserAvatar from "../UserAvatar";
import CommentForm from "../CommentForm";
import "./index.scss";

const Comment = ({
  comment,
  itemsId,
  level = 0,
  formatTimeDiff,
  onReplyClick,
  replyToMap,
  newCommentMap,
  isSubmittingComment,
  handleCommentChange,
  handleKeyPress,
  handleSubmitComment,
  handleCancelReply,
  currentUsername,
}) => {
  return (
    <div key={comment.id} style={{ marginLeft: level * 24 }}>
      <List.Item className="comment-item">
        <div className="comment-avatar">
          <UserAvatar username={comment.created_by?.username} />
        </div>
        <div className="comment-content">
          <div className="comment-author">
            {comment.created_by?.username || "Unknown User"}
          </div>
          <div className="comment-text">{comment.content}</div>
          <div className="comment-footer">
            <span className="comment-time">
              {formatTimeDiff(comment.created_at)}
            </span>
            <Button
              type="link"
              onClick={() => onReplyClick(itemsId, comment.id)}
            >
              Reply
            </Button>
          </div>
        </div>
      </List.Item>

      {comment.children?.map((child) => (
        <Comment
          key={child.id}
          comment={child}
          itemsId={itemsId}
          level={level + 1}
          formatTimeDiff={formatTimeDiff}
          onReplyClick={onReplyClick}
          replyToMap={replyToMap}
          newCommentMap={newCommentMap}
          isSubmittingComment={isSubmittingComment}
          handleCommentChange={handleCommentChange}
          handleKeyPress={handleKeyPress}
          handleSubmitComment={handleSubmitComment}
          handleCancelReply={handleCancelReply}
          currentUsername={currentUsername}
        />
      ))}

      {replyToMap[itemsId] === comment.id && (
        <div className="reply-input" style={{ marginLeft: (level + 1) * 24 }}>
          <CommentForm
            value={newCommentMap[itemsId] || ""}
            onChange={(e) => handleCommentChange(itemsId, e)}
            onKeyDown={(e) => handleKeyPress(itemsId, e)}
            onSubmit={() => handleSubmitComment(itemsId)}
            isSubmitting={isSubmittingComment[itemsId]}
            placeholder="Write a reply..."
            username={currentUsername}
            onCancel={() => handleCancelReply(itemsId)}
          />
        </div>
      )}
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  itemsId: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  formatTimeDiff: PropTypes.func.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  replyToMap: PropTypes.object.isRequired,
  newCommentMap: PropTypes.object.isRequired,
  isSubmittingComment: PropTypes.object.isRequired,
  handleCommentChange: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired,
  handleSubmitComment: PropTypes.func.isRequired,
  handleCancelReply: PropTypes.func.isRequired,
  currentUsername: PropTypes.string.isRequired,
};

export default Comment; 