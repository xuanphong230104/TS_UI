import { Badge, Table, Tag, Typography } from "antd";
import PropTypes from "prop-types";

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
    title: "Priority",
    dataIndex: "priority",
    key: "proj_priority",
    render: (text) => {
      let color = "";

      if (text === "low") {
        color = "cyan";
      } else if (text === "medium") {
        color = "geekblue";
      } else {
        color = "magenta";
      }

      return (
        <Tag color={color} className="text-capitalize">
          {text}
        </Tag>
      );
    },
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

const ProjectsTable = ({ data, ...others }) => {
  const addKeyForData = data.map((item) => ({ key: item.project_id, ...item }));
  return (
    <Table
      dataSource={addKeyForData}
      columns={COLUMNS}
      bordered={false}
      className="overflow-scroll"
      {...others}
      scroll={{
        x: "max-content",
      }}
    />
  );
};

ProjectsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProjectsTable;
