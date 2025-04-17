import PropTypes from "prop-types";
import { List } from "antd";
import Comment from "../Comment";
import CommentForm from "../CommentForm";
import "./styles.scss";

const CommentSection = ({
  items,
  comments,
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
  // Sort comments by date before rendering (oldest to newest)
  const sortComments = (comments = []) => {
    return [...comments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  };

  return (
    <div className="comments-container">
      <List
        itemLayout="horizontal"
        dataSource={sortComments(comments) || []}
        className="comments-list"
        renderItem={(comment) => (
          <Comment
            comment={comment}
            itemsId={items.id}
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
        )}
      />

      {!replyToMap[items.id] && (
        <CommentForm
          value={newCommentMap[items.id] || ""}
          onChange={(e) => handleCommentChange(items.id, e)}
          onKeyDown={(e) => handleKeyPress(items.id, e)}
          onSubmit={() => handleSubmitComment(items.id)}
          isSubmitting={isSubmittingComment[items.id]}
          placeholder="Write a comment..."
          username={currentUsername}
        />
      )}
    </div>
  );
};

CommentSection.propTypes = {
  items: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
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
export default CommentSection; 