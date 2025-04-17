import { Input, Button, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import UserAvatar from "../UserAvatar";
import PropTypes from "prop-types";
import "./styles.scss";

const { TextArea } = Input;

const CommentForm = ({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  isSubmitting,
  placeholder = "Write a comment...",
  username,
  onCancel = null,
}) => {
  return (
    <div className="new-comment">
      <div className="comment-avatar">
        <UserAvatar username={username} />
      </div>
      <div className="comment-input-container">
        <TextArea
          value={value || ""}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoSize={{ minRows: 1, maxRows: 4 }}
          className="comment-input"
          disabled={isSubmitting}
        />
        <Button
          type="primary"
          icon={isSubmitting ? <Spin size="small" /> : <SendOutlined />}
          onClick={onSubmit}
          disabled={!value?.trim() || isSubmitting}
          className="send-button"
        />
        {onCancel && (
          <Button
            onClick={onCancel}
            style={{ marginLeft: 8 }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  placeholder: PropTypes.string,
  username: PropTypes.string,
  onCancel: PropTypes.func,
};
export default CommentForm; 