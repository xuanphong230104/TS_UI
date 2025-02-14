import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown, Flex, Input, Layout, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionOutlined,
  LogoutOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { PATH } from "../../constants";
import userImage from "../../../public/images/user.jpg";
import Logo from "../../../public/images/Logo.svg";
import "./index.scss";

const Header = (props) => {
  const {
    collapsed,
    setCollapsed,
    isMobile,
    drawerVisible,
    setDrawerVisible,
    authentication,
  } = props;
  const { user } = authentication;

  const navigate = useNavigate();

  const items = [
    {
      key: "user-profile",
      label: "profile",
      icon: <UserOutlined />,
    },
    {
      key: "user-settings",
      label: "settings",
      icon: <SettingOutlined />,
    },
    {
      key: "user-help",
      label: "help center",
      icon: <QuestionOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        navigate(PATH.login);
      },
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
          <Input.Search placeholder="search" />
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
            {user && <div className="username">{user.username}</div>}
          </Flex>
        </Dropdown>
      </Flex>
    </Layout.Header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  drawerVisible: PropTypes.bool.isRequired,
  setDrawerVisible: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  authentication: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return { authentication };
};

export default connect(mapStateToProps)(Header);
