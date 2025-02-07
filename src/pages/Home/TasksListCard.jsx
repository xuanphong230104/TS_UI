import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  List,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  FlagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import data from "../../mocks/TasksList.json";

const TasksListCard = () => {
  return (
    <Card
      title="Tasks"
      extra={<Button>View all</Button>}
      className="tasks-list-card card"
      style={{ boxShadow: "none" }}
      bordered={false}
    >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 4,
        }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 6,
          align: "center",
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item.name} style={{ height: "100%" }}>
            <Card hoverable bordered type="inner" style={{ height: "100%" }}>
              <Flex vertical gap="middle">
                <Flex justify="space-between" align="center">
                  <Typography.Text strong className="text-capitalize">
                    {item.name.slice(0, 20)}...
                  </Typography.Text>
                  <Tag className="text-capitalize">{item.category}</Tag>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Tag
                    icon={<FlagOutlined />}
                    color={item.color}
                    style={{ textTransform: "capitalize" }}
                  >
                    {item.priority}
                  </Tag>
                  <Badge
                    className="text-capitalize"
                    status={
                      item.status.toLowerCase() === "completed"
                        ? "success"
                        : item.status.toLowerCase() === "in progress"
                          ? "processing"
                          : "warning"
                    }
                    text={item.status}
                  />
                </Flex>
                <Space>
                  <CalendarOutlined />
                  <Typography.Text>{item.due_date}</Typography.Text>
                </Space>
                <Flex gap="small" align="center">
                  <Avatar
                    icon={<UserOutlined />}
                    size="small"
                    style={{ backgroundColor: "#076ee5" }}
                  />
                  <Typography.Text
                    style={{
                      fontSize: 16,
                      width: 160,
                    }}
                  >
                    {item.assigned_to}
                  </Typography.Text>
                </Flex>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TasksListCard;
