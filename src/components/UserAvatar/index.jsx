import PropTypes from "prop-types";
import { Avatar } from 'antd';

const UserAvatar = ({ username, size = 'default' }) => {
  const initials = username?.substring(0, 2).toUpperCase() || 'UN';
  
  return (
    <Avatar size={size} style={{ backgroundColor: '#0a2647' }}>
      {initials}
    </Avatar>
  );
};

UserAvatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large']),
};

export default UserAvatar;