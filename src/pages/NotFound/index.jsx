import { Link } from "react-router-dom";
import { Button, Result } from "antd";

const NotFound = () => {
  return (
    <div className="centered-container">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
