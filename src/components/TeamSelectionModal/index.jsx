import React, { useState, useEffect } from "react";
import { Modal, Radio, Button, Typography, Avatar, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { API_ENDPOINTS } from "../../constants";
import axiosClient from "../../helpers/axiosClient";
import "./index.scss";

const { Title, Text } = Typography;

const TeamSelectionModal = ({ visible, onTeamSelect, currentUser }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axiosClient.get(API_ENDPOINTS.TEAM).then((response) => {
      console.log("data", response.data.data);
      setTimeout(() => {
        const teamsWithGradient = response.data.data.map((team) => {
          let gradient;
          switch (team.id % 4) {
            case 0:
              gradient = "linear-gradient(135deg, #1890ff, #096dd9)";
              break;
            case 1:
              gradient = "linear-gradient(135deg, #722ed1, #531dab)";
              break;
            case 2:
              gradient = "linear-gradient(135deg, #52c41a, #389e0d)";
              break;
            case 3:
              gradient = "linear-gradient(135deg, #faad14, #d48806)";
              break;
            default:
              gradient = "linear-gradient(135deg, #1890ff, #096dd9)";
          }
          return {
            ...team,
            gradient,
          };
        });
        setTeams(teamsWithGradient);
        setLoading(false);
      }, 1000);
    });
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
