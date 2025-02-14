import { Card, Col, Row } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.scss";
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
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Card
            className="dashboard-card"
            bordered={false}
            style={{ boxShadow: "none" }}
            tabList={PROJECT_TABS}
            activeTabKey={projectTabsKey}
            onTabChange={onProjectsTabChange}
            styles={{ body: { padding: 0 } }}
          >
            <div className="updates-container">
              <div className="time-card">
                <div className="date-text">Wednesday</div>
                <div className="time-text ">February 5</div>
              </div>

              <div className="post-container">
                <div className="post-header">
                  <div className="avatar">NP</div>
                  <div className="post-info">
                    <p className="post-author">NGUYEN PHONG</p>
                    <p className="post-time">2 days ago</p>
                  </div>
                  <div className="post-menu">...</div>
                </div>

                <div className="post-content">
                  <div className="post-section">
                    <div className="section-label">Blockers</div>
                    <p className="section-text">Blocker test</p>
                  </div>
                  <div className="post-section">
                    <div className="section-label">Next</div>
                    <p className="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div className="post-section">
                    <div className="section-label">Previously</div>
                    <p className="section-text">Continued on designing UI</p>
                  </div>

                  <div className="post-footer">
                    <div className="footer-item">
                      <MessageOutlined />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="updates-container">
              <div className="time-card">
                <div className="date-text">Wednesday</div>
                <div className="time-text ">February 5</div>
              </div>

              <div className="post-container">
                <div className="post-header">
                  <div className="avatar">NP</div>
                  <div className="post-info">
                    <p className="post-author">NGUYEN PHONG</p>
                    <p className="post-time">6 days ago</p>
                  </div>
                  <div className="post-menu">...</div>
                </div>

                <div className="post-content">
                  <div className="post-section">
                    <div className="section-label">Blockers</div>
                    <p className="section-text">Blocker test</p>
                  </div>
                  <div className="post-section">
                    <div className="section-label">Next</div>
                    <p className="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div className="post-section">
                    <div className="section-label">Previously</div>
                    <p className="section-text">Continued on designing UI</p>
                  </div>

                  <div className="post-footer">
                    <div className="footer-item">
                      <MessageOutlined />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="updates-container">
              <div className="time-card">
                <div className="date-text">Tuesday</div>
                <div className="time-text ">February 4</div>
              </div>

              <div className="post-container ">
                <div className="post-header">
                  <div className="avatar">NP</div>
                  <div className="post-info">
                    <p className="post-author">NGUYEN Paul</p>
                    <p className="post-time">6 days ago</p>
                  </div>
                  <div className="post-menu">...</div>
                </div>

                <div className="post-content">
                  <div className="post-section">
                    <div className="section-label">Next</div>
                    <p className="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div className="post-section">
                    <div className="section-label">Previously</div>
                    <p className="section-text">Continued on designing UI</p>
                  </div>

                  <div className="post-footer">
                    <div className="footer-item">
                      <MessageOutlined />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
