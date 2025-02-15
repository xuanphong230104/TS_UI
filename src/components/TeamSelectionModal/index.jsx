import React, { useState, useEffect } from "react";
import { Modal, Radio, Button, Typography, Avatar, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { Title, Text } = Typography;

const TeamSelectionModal = ({ visible, onTeamSelect, currentUser }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setTeams([
        {
          id: 1,
          name: "Development Team",
          description: "Frontend and Backend Development",
          memberCount: 8,
          activeProjects: 12,
          gradient: "linear-gradient(135deg, #1890ff, #096dd9)",
          tags: ["React", "Node.js", "TypeScript"],
          activity: "high",
        },
        {
          id: 2,
          name: "Design Team",
          description: "UI/UX and Product Design",
          memberCount: 5,
          activeProjects: 8,
          gradient: "linear-gradient(135deg, #722ed1, #531dab)",
          tags: ["UI/UX", "Figma", "Design Systems"],
          activity: "medium",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTeamSelect = () => {
    if (selectedTeam) {
      onTeamSelect(selectedTeam);
    }
  };

  return (
    <Modal
      open={visible}
      title={null}
      footer={null}
      closable={false}
      width={700}
      className="team-selection-modal"
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="header-icon-wrapper">
            <TeamOutlined className="header-icon" />
          </div>
          <Title level={3}>Welcome to Your Workspace</Title>
          <Text className="welcome-text">
            Hi {currentUser?.name || "there"}! Choose your team to get started
          </Text>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-animation">
              <Spin size="large" />
            </div>
            <Text>Fetching your teams...</Text>
          </div>
        ) : (
          <Radio.Group
            onChange={(e) => setSelectedTeam(e.target.value)}
            value={selectedTeam}
            className="teams-container"
          >
            {teams.map((team, index) => (
              <Radio key={team.id} value={team.id} className="team-option">
                <div
                  className="team-card"
                  style={{
                    "--team-gradient": team.gradient,
                    "--animation-delay": `${index * 0.1}s`,
                  }}
                >
                  <div className="team-card-content">
                    <div className="team-avatar-section">
                      <Avatar
                        size={60}
                        style={{
                          background: team.gradient,
                        }}
                        icon={<TeamOutlined />}
                      />
                      <div className={`activity-indicator ${team.activity}`} />
                    </div>

                    <div className="team-info">
                      <Text strong className="team-name">
                        {team.name}
                      </Text>
                      <Text className="team-description">
                        {team.description}
                      </Text>

                      <div className="team-stats">
                        <div className="stat">
                          <UserOutlined />
                          <span>{team.memberCount} members</span>
                        </div>
                        <div className="stat">
                          <StarOutlined />
                          <span>{team.activeProjects} projects</span>
                        </div>
                      </div>

                      <div className="team-tags">
                        {team.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="selection-indicator">
                      <CheckCircleOutlined />
                    </div>
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        )}

        <div className="modal-footer">
          <Button
            type="primary"
            size="large"
            onClick={handleTeamSelect}
            disabled={!selectedTeam}
            className="continue-button"
          >
            Continue to Workspace
            <div className="button-glow" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TeamSelectionModal;
