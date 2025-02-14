import { useEffect } from "react";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import authActions from "../../actions/authActions";
import { PATH } from "../../constants";

const PrivateRouter = (props) => {
  const { children, authentication, dispatch } = props;
  const { isLogged, isLoading, user } = authentication;

  useEffect(() => {
    if (!user) dispatch(authActions.getUserLogin());
  }, []);

  if (isLoading) {
    return (
      <div className="centered-container">
        <Spin />
      </div>
    );
  }

  return isLogged ? children : <Navigate to={PATH.login} />;
};

PrivateRouter.propTypes = {
  children: PropTypes.node.isRequired,
  dispatch: PropTypes.func.isRequired,
  authentication: PropTypes.shape({
    isLogged: PropTypes.bool,
    isLoading: PropTypes.bool,
    user: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return {
    authentication,
  };
};

export default connect(mapStateToProps)(PrivateRouter);
