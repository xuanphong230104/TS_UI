import React, { useState } from "react";
import TeamSelectionModal from "../../components/TeamSelectionModal";
const TeamSelect = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const currentUser = { name: "John Doe" }; // Your user data

  const handleTeamSelect = (teamId) => {
    console.log("Selected team:", teamId);
    setIsModalVisible(false);
    // Handle team selection
  };

  return (
    <TeamSelectionModal
      visible={isModalVisible}
      onTeamSelect={handleTeamSelect}
      currentUser={currentUser}
    />
  );
};

export default TeamSelect;
