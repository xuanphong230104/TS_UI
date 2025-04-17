import PropTypes from "prop-types";
import TimeHeader from "../TimeHeader";
import PostSection from "../PostSection";
import "./index.scss";

const DayGroup = ({
  date,
  weekday,
  groupedItems,
  itemType,
  formatTimeDiff,
  commentVisibleMap,
  toggleCommentSection,
  getCommentCount,
  onReplyClick,
  replyToMap,
  newCommentMap,
  isSubmittingComment,
  handleCommentChange,
  handleKeyPress,
  handleSubmitComment,
  handleCancelReply,
  currentUsername,
  showCheckInsMap,
  toggleCheckInsSection,
}) => {
  // Check if groupedItems exists and is an array before mapping
  if (!groupedItems || !Array.isArray(groupedItems)) {
    return null;
  }

  return (
    <div className="day-group">
      <TimeHeader weekday={weekday} date={date} />

      {groupedItems.map((item) => (
        <PostSection
          key={item.id}
          items={item}
          itemType={itemType}
          formatTimeDiff={formatTimeDiff}
          commentVisibleMap={commentVisibleMap}
          toggleCommentSection={toggleCommentSection}
          getCommentCount={getCommentCount}
          onReplyClick={onReplyClick}
          replyToMap={replyToMap}
          newCommentMap={newCommentMap}
          isSubmittingComment={isSubmittingComment}
          handleCommentChange={handleCommentChange}
          handleKeyPress={handleKeyPress}
          handleSubmitComment={handleSubmitComment}
          handleCancelReply={handleCancelReply}
          currentUsername={currentUsername}
          showCheckInsMap={showCheckInsMap}
          toggleCheckInsSection={toggleCheckInsSection}
        />
      ))}
    </div>
  );
};

DayGroup.propTypes = {
  date: PropTypes.string.isRequired,
  weekday: PropTypes.string.isRequired,
  groupedItems: PropTypes.array.isRequired,
  itemType: PropTypes.string.isRequired,
  formatTimeDiff: PropTypes.func.isRequired,
  commentVisibleMap: PropTypes.object.isRequired,
  toggleCommentSection: PropTypes.func.isRequired,
  getCommentCount: PropTypes.func.isRequired,
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

export default DayGroup;
