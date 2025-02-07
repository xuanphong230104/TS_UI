import { Layout, Menu, Drawer } from "antd";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PATH } from "../../constants";
import Logo from "../../../public/images/Logo.svg";
import "./index.scss";

const { Sider } = Layout;

const SideNav = (props) => {
  const { collapsed, setCollapsed, isMobile, drawerVisible, setDrawerVisible } =
    props;
  const location = useLocation();

  const onClose = () => {
    setDrawerVisible(false);
  };

  const getItem = (label, key, icon, children) => ({
    key,
    icon,
    children,
    label: (
      <Link onClick={onClose} to={key}>
        {label}
      </Link>
    ),
  });

  const items = [
    getItem("Dashboard", PATH.home, <PieChartOutlined />),
    getItem("Check ins", PATH.checkins, <CheckCircleOutlined />),
    getItem("Test Design", PATH.report, <FileTextOutlined />),
    getItem("Users", PATH.users, <UserOutlined />),
  ];

  const renderMobileSideNav = () => {
    return (
      <Drawer
        className="mobile-side-nav"
        placement="left"
        onClose={onClose}
        closable={false}
        open={drawerVisible}
        width={250}
      >
        <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
      </Drawer>
    );
  };

  if (isMobile) return renderMobileSideNav();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      className="side-nav-wrapper"
      onCollapse={(_collapsed) => {
        setCollapsed(_collapsed);
      }}
    >
      <div>
        <Link to="/" className="logo-wrapper">
          <img src={Logo} alt="TranInc logo" width={collapsed ? 70 : 150} />
        </Link>
      </div>
      <Menu mode="inline" selectedKeys={[location.pathname]} items={items} />
    </Sider>
  );
};

SideNav.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
  drawerVisible: PropTypes.bool.isRequired,
  setDrawerVisible: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default SideNav;
