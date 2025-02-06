import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Button, Dropdown, Flex, Layout, Tooltip, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import userImage from "../../../public/images/user.jpg";
import Logo from "../../../public/images/Logo.svg";
import "./index.scss";

const Header = (props) => {
  const { collapsed, setCollapsed, isMobile, drawerVisible, setDrawerVisible } =
    props;

  const items = [
    {
      key: "user-profile",
      label: <Link>Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "user-settings",
      label: <Link>Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <Link>Logout</Link>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleCollapse = () => {
    if (isMobile) setDrawerVisible(!drawerVisible);
    else setCollapsed(!collapsed);
  };

  return (
    <Layout.Header className="header-wrapper">
      <Flex align="center" gap="small" className="header-left">
        <Button
          type="text"
          className="collapsed-side-nav-btn"
          icon={
            collapsed || isMobile ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )
          }
          onClick={handleCollapse}
        />
        {isMobile ? (
          <Link to="/" className="logo-wrapper">
            <img src={Logo} alt="TranInc logo" width={130} />
          </Link>
        ) : (
          <Typography.Title className="header-title" level={5}>
            Transparent Test System
          </Typography.Title>
        )}
      </Flex>
      <Flex align="center" gap="small" className="header-right">
        <Tooltip title="Messages">
          <Button
            icon={<MessageOutlined />}
            aria-label="messages"
            type="text"
            size="large"
          />
        </Tooltip>
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          className="dropdown-user-profile"
        >
          <Flex align="center">
            <img src={userImage} alt="user profile photo" />
            {/* {user && <div className="username">{user.username}</div>} */}
          </Flex>
        </Dropdown>
      </Flex>
    </Layout.Header>
  );
};




export default Header
