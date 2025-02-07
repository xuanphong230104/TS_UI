import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { PATH } from "../../constants";
import authActions from "../../actions/authActions";
import login from "../../../public/images/Logo.svg";
import "./index.scss";

const { Title } = Typography;

const Login = (props) => {
  const { authentication, dispatch } = props;
  const { isLoading, error, isLogged } = authentication;
  const [formValueChanged, setFormValueChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) dispatch(authActions.logout());
  }, []);

  const loginSuccess = () => {
    navigate(PATH.home);
  };

  const onFinish = (values) => {
    dispatch(authActions.login(values, loginSuccess));
    setFormValueChanged(false);
  };

  return (
    <Row className="login-container">
      <Col xs={24} md={12} className="login-left">
        <Flex vertical justify="center">
          <img src={login} alt="Logo TranInc" />
          <Title level={2}>Transparent Test System</Title>
        </Flex>
      </Col>
      <Col xs={24} md={12} className="login-right">
        <Flex vertical justify="center" gap="middle">
          <Title>Login</Title>
          <Form
            name="sign-up-form"
            layout="vertical"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onChange={() => {
              if (!formValueChanged) setFormValueChanged(true);
            }}
            autoComplete="on"
            requiredMark={false}
          >
            <Row gutter={[8, 0]}>
              <Col span={24}>
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Username!",
                    },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                  />
                </Form.Item>
                {error && !formValueChanged && (
                  <Form.Item>
                    <Alert
                      message={error.message}
                      type="error"
                      showIcon
                      banner
                    />
                  </Form.Item>
                )}
              </Col>
              <Col span={24}>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Flex align="center" justify="space-between">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  loading={isLoading}
                >
                  Log In
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </Row>
  );
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  authentication: PropTypes.shape({
    error: PropTypes.object,
    isLoading: PropTypes.bool,
    isLogged: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { authentication } = state;
  return { authentication };
};

export default connect(mapStateToProps)(Login);
