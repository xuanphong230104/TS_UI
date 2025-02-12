import React from "react";
import { Button } from "antd";
import { useState } from "react";
import TaskModal from "../../components/TaskModal";
const Checkins = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => setIsModalVisible(true)}>Create Task</Button>

        <TaskModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </div>
    </div>
  );
};

export default Checkins;
