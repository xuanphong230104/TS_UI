import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Button, Col, Flex, Row, Typography } from "antd";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { python } from "@codemirror/lang-python";

import "./index.scss";

const { Title } = Typography;

const TestDesign = () => {
  const [code, setCode] = useState("");

  const handleChange = (value) => {
    setCode(value);
  };

  const handleSaveTest = () => {};

  return (
    <div className="test-design-container">
      <Row>
        <Col span={24}>
          <Title level={3}>Edit Test Information</Title>
          <div className="code-editor">
            <CodeMirror
              value={code}
              minHeight="200px"
              maxHeight="500px"
              theme={vscodeLight}
              extensions={[python()]}
              onChange={handleChange}
              placeholder="Please write your test here..."
            />
          </div>
          <Flex gap="middle" justify="flex-end">
            <Button type="primary">Save Test</Button>
            <Button type="primary">Run Test</Button>
            <Button type="primary" onClick={handleSaveTest}>
              Run & Save Test
            </Button>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};
export default TestDesign;
