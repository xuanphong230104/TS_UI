import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Result, Button } from "antd";
import { useErrorBoundary } from "react-error-boundary";
import { PATH } from "../../constants";

const ErrorFallback = ({ error }) => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <div className="centered-container">
      <Result
        status="404"
        title={`Oops! Got error: ${error.message}`}
        extra={
          <Button type="primary" onClick={resetBoundary}>
            <Link to={PATH.home}>Back Home</Link>
          </Button>
        }
      ></Result>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
};

export default ErrorFallback;
