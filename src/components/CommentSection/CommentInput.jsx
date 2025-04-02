import React from 'react';
import { Input, Button, Spin } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import UserAvatar from '../UserAvatar';

const { TextArea } = Input;

const CommentInput = ({
  username,
  value,
  onChange,
  onKeyDown,
  onSubmit,
  isSubmitting,
  placeholder = 'Write a comment...',
  showCancelButton = false,
  onCancel = null,
}) => {
  return (
    <div className="new-comment">
      <div className="comment-avatar">
        <UserAvatar username={username} />
      </div>
      <div className="comment-input-container">
        <TextArea
          value={value || ''}
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
          className="comment-send"
        />
        {showCancelButton && (
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

export default CommentInput;