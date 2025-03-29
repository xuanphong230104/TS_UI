import { useEffect, useState } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axiosClient from '../../helpers/axiosClient';
import { API_ENDPOINTS } from '../../constants';
import { Spin } from 'antd';

const TeamLayout = (props) => {
  const { authentication } = props;
  const { user } = authentication;
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkTeamAccess = async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.TEAM);
        const team = response.data.data.find(t => t.id === parseInt(teamId));
        const userHasAccess = team?.user_teams.some(userTeam => userTeam.user === user.id);

        if (!userHasAccess) {
          // Redirect to team selection if user doesn't have access
          navigate('/team-select');
          return;
        }

        setHasAccess(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking team access:', error);
        navigate('/team-select');
      }
    };

    if (teamId && user?.id) {
      checkTeamAccess();
    }
  }, [teamId, user?.id, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <Outlet />;
};

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

export default connect(mapStateToProps)(TeamLayout);