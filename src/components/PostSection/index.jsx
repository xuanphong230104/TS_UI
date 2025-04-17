import PropTypes from "prop-types";
import { Dropdown, Tag, Divider } from "antd";
import {
  MessageOutlined,
  SettingOutlined,
  SwapOutlined,
  UserOutlined,
  CalendarOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import UserAvatar from "../UserAvatar";
import RichTextEditor from "../RichTextEditor";
import CommentSection from "../CommentSection";
import "./index.scss";

const PostSection = ({
  items,
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
  const tagColor = itemType === "reports" ? "blue" : "green";
  const tagText = itemType === "reports" ? "Reports" : "Checkins";

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="avatar">
          <UserAvatar username={items.created_by?.username} />
        </div>
        <div className="post-info">
          <p className="post-author">
            {items.created_by?.username?.toUpperCase() || "UNKNOWN USER"}
          </p>
          <p className="post-time">
            {formatTimeDiff(items.created_at)}
            <Tag color={tagColor} style={{ marginLeft: 6 }}>
              {tagText}
            </Tag>
          </p>
        </div>
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                icon: <SettingOutlined />,
              },
              {
                key: "view-detail",
                label: "View Detail",
                icon: <UserOutlined />,
              },
            ],
          }}
          trigger={["click"]}
        >
          <div className="post-menu">...</div>
        </Dropdown>
      </div>

      <div className="post-content">
        <div className="post-section">
          <RichTextEditor
            initValue={items.object?.content || items.content}
            readOnly={true}
          />
        </div>
        <div className="post-footer">
          <div
            className={`comment-section ${commentVisibleMap[items.id] ? 'active' : ''}`}
            onClick={() => toggleCommentSection(items.id)}
          >
            <MessageOutlined />
            <span>{getCommentCount(items.comments)} comments</span>
          </div>


          {/* Add Show Check-in button only for reports */}
          {itemType === "reports" && (
            <>
              <div
                className={`comment-section ${showCheckInsMap[items.id] ? 'active' : ''}`}
                onClick={() => toggleCheckInsSection(items.id)}
              >
                <SwapOutlined />
                <span>Show Check-in</span>
              </div>

              {showCheckInsMap[items.id] && (
                <div className="checkin-comparison">
                  <Divider orientation="left">
                    <CalendarOutlined /> Associated Check-in
                  </Divider>
                  {items.check_in ? (
                    <div className="checkin-content">
                      <div className="checkin-header">
                        <UserAvatar username={items.check_in.created_by?.username} />
                        <span className="checkin-author">
                          {items.check_in.created_by?.username || 'Unknown'} · {formatTimeDiff(items.check_in.created_at)}
                        </span>
                      </div>
                      <div className="checkin-body">
                        <RichTextEditor
                          initValue={items.check_in.content}
                          readOnly={true}
                        />
                      </div>

                      {/* Task comparison section */}
                      {items.tasks && items.tasks.length > 0 && items.check_in.tasks && items.check_in.tasks.length > 0 && (
                        <div className="task-comparison">
                          <div className="comparison-header">
                            <div className="comparison-title">
                              <SyncOutlined /> Task Progress Comparison
                            </div>
                          </div>

                          {/* <div className="comparison-grid">
                          <div className="comparison-column">
                            <h4>Check-in Tasks</h4>
                            <TaskProgressList 
                              tasks={items.check_in.tasks} 
                              compareMode={true} 
                            />
                          </div>
                          
                          <div className="comparison-column">
                            <h4>Report Tasks</h4>
                            <TaskProgressList 
                              tasks={items.tasks} 
                              compareMode={true} 
                            />
                          </div>
                        </div> */}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-checkin">No associated check-in found</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {commentVisibleMap[items.id] && (
          <CommentSection
            items={items}
            comments={items.comments}
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
      </div>
    </div>
  );
};

PostSection.propTypes = {
  items: PropTypes.object.isRequired,
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
  showCheckInsMap: PropTypes.object,
  toggleCheckInsSection: PropTypes.func,
};

export default PostSection;
