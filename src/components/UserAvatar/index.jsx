import React from 'react';
import { Avatar } from 'antd';

const UserAvatar = ({ username, size = 'default' }) => {
  const initials = username?.substring(0, 2).toUpperCase() || 'UN';
  
  return (
    <Avatar size={size} style={{ backgroundColor: '#0a2647' }}>
      {initials}
    </Avatar>
  );
};

export default UserAvatar;