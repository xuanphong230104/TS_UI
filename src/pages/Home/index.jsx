import { CloudUploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space } from "antd";
import { useState } from "react";
import ProjectsTable from "./ProjectsTable";
import TasksListCard from "./TasksListCard";
import projectsData from "../../mocks/Projects.json";

const PROJECT_TABS = [
  {
    key: "allUpdates",
    label: "All Updates",
  },
  {
    key: "checkIns",
    label: "Check-ins",
  },
  {
    key: "reports",
    label: "Reports",
  },
];

const Home = () => {
  const [projectTabsKey, setProjectsTabKey] = useState("allUpdates");

  const onProjectsTabChange = (key) => {
    setProjectsTabKey(key);
  };

  return (
    <div>
      <Row gutter={[0, 48]}>
        <Col span={24}>
          <Card
            title="Projects"
            className="dashboard-project-card"
            bordered={false}
            style={{ boxShadow: "none" }}
            tabList={PROJECT_TABS}
            activeTabKey={projectTabsKey}
            onTabChange={onProjectsTabChange}
          >
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
