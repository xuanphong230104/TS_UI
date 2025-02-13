import { Button, Card, Col, Row, Space } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useState } from "react";
import projectsData from "../../mocks/Projects.json";
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
            style={{boxShadow: "none"}}
            tabList={PROJECT_TABS}
            activeTabKey={projectTabsKey}
            onTabChange={onProjectsTabChange}
            styles={{ body: { padding: 0 } }}
          >
            <div class="updates-container">
              <div className="time-card">
                <div class="date-text">Wednesday</div>
                <div class="time-text ">February 5</div>
              </div>

              <div class="post-container">
                <div class="post-header">
                  <div class="avatar">NP</div>
                  <div class="post-info">
                    <p class="post-author">NGUYEN PHONG</p>
                    <p class="post-time">2 days ago</p>
                  </div>
                  <div class="post-menu">...</div>
                </div>

                <div class="post-content">
                  <div class="post-section">
                    <div class="section-label">Blockers</div>
                    <p class="section-text">Blocker test</p>
                  </div>
                  <div class="post-section">
                    <div class="section-label">Next</div>
                    <p class="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div class="post-section">
                    <div class="section-label">Previously</div>
                    <p class="section-text">Continued on designing UI</p>
                  </div>

                  <div class="post-footer">
                    <div class="footer-item">
                      <MessageOutlined />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="updates-container">
              <div className="time-card">
                <div class="date-text">Wednesday</div>
                <div class="time-text ">February 5</div>
              </div>

              <div class="post-container">
                <div class="post-header">
                  <div class="avatar">NP</div>
                  <div class="post-info">
                    <p class="post-author">NGUYEN PHONG</p>
                    <p class="post-time">6 days ago</p>
                  </div>
                  <div class="post-menu">...</div>
                </div>

                <div class="post-content">
                  <div class="post-section">
                    <div class="section-label">Blockers</div>
                    <p class="section-text">Blocker test</p>
                  </div>
                  <div class="post-section">
                    <div class="section-label">Next</div>
                    <p class="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div class="post-section">
                    <div class="section-label">Previously</div>
                    <p class="section-text">Continued on designing UI</p>
                  </div>

                  <div class="post-footer">
                    <div class="footer-item">
                      <MessageOutlined />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="updates-container">
              <div className="time-card">
                <div class="date-text">Tuesday</div>
                <div class="time-text ">February 4</div>
              </div>

              <div class="post-container ">
                <div class="post-header">
                  <div class="avatar">NP</div>
                  <div class="post-info">
                    <p class="post-author">NGUYEN Paul</p>
                    <p class="post-time">6 days ago</p>
                  </div>
                  <div class="post-menu">...</div>
                </div>

                <div class="post-content">
                  <div class="post-section">
                    <div class="section-label">Next</div>
                    <p class="section-text">
                      Continue testing on Design on Figma
                    </p>
                  </div>

                  <div class="post-section">
                    <div class="section-label">Previously</div>
                    <p class="section-text">Continued on designing UI</p>
                  </div>

                  <div class="post-footer">
                    <div class="footer-item">
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
