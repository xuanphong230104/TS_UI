import { Badge, Table, Typography } from "antd";
import data from "../../mocks/Projects.json";

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "project_name",
    key: "proj_name",
    render: (_, { project_name }) => (
      <Typography.Paragraph
        ellipsis={{ rows: 1 }}
        className="text-capitalize"
        style={{ marginBottom: 0 }}
      >
        {project_name.substring(0, 20)}
      </Typography.Paragraph>
    ),
  },
  {
    title: "Client",
    dataIndex: "client_name",
    key: "proj_client_name",
  },
  {
    title: "Category",
    dataIndex: "project_category",
    key: "proj_category",
    render: (text) => <span className="text-capitalize">{text}</span>,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "proj_status",
    render: (record) => {
      let status = "";

      if (record === "on hold") {
        status = "default";
      } else if (record === "completed") {
        status = "success";
      } else {
        status = "processing";
      }

      return (
        <Badge status={status} text={record} className="text-capitalize" />
      );
    },
  },
  {
    title: "Team size",
    dataIndex: "team_size",
    key: "proj_team_size",
  },
  {
    title: "Duration",
    dataIndex: "project_duration",
    key: "project_duration",
  },
  {
    title: "Start date",
    dataIndex: "start_date",
    key: "proj_start_date",
  },
];

const TestDesign = () => {
  const addKeyForData = data.map((item) => ({ key: item.project_id, ...item }));
  return (
    <Table
      style={{ padding: "24px" }}
      dataSource={addKeyForData}
      columns={COLUMNS}
      bordered={false}
      scroll={{
        x: "max-content",
      }}
    />
  );
};
export default TestDesign;
