import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../../constants";
import axiosClient from "../../helpers/axiosClient";
import { useState, useEffect } from "react";
import { Modal, Radio, Button, Typography, Avatar, Spin } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const TeamSelectionModal = (props) => {
  const { authentication, visible, onTeamSelect, currentUser } = props;
  const { user } = authentication;
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get(API_ENDPOINTS.TEAM).then((response) => {
      //set gradient color for each avatar's team and count members in each team
      const userTeams = response.data.data.filter((team) =>
        team.user_teams.some((userTeam) => userTeam.user === user.id)
      );

      if (userTeams.length === 0) {
        setTeams([]);
        setLoading(false);
        return;
      }
      const teamsGradientAndCountMember = userTeams.map((team) => {
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
          userTeamCount: team.user_teams.length,
          gradient,
        };
      });
      setTeams(teamsGradientAndCountMember);
      setLoading(false);
    });
  }, []);

  const handleTeamSelect = () => {
    if (selectedTeam) {
      onTeamSelect(selectedTeam);
    }
    navigate(`/teams/${selectedTeam}`);
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
        ) : teams.length === 0 ? (
          <div className="no-teams-container">
            <TeamOutlined className="no-teams-icon" />
            <Title level={4}>No Teams Available</Title>
            <Text>
              You are not a member of any teams yet. Please contact your
              administrator to be added to a team.
            </Text>
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
                          <span>{team.userTeamCount} members</span>
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

TeamSelectionModal.propTypes = {
  visible: PropTypes.bool,
  onTeamSelect: PropTypes.func,
  currentUser: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return { authentication };
};

export default connect(mapStateToProps)(TeamSelectionModal);
