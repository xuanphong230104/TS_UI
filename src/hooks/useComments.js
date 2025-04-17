import { useState } from "react";
import axiosClient from "../helpers/axiosClient";
import { API_ENDPOINTS } from "../constants";

/**
 * Custom hook to manage comments functionality
 * @param {string} teamId - Current team ID 
 * @returns {Object} - Comment state and handlers
 */
const useComments = (teamId, contentType = "checkin") => {
  const [commentVisibleMap, setCommentVisibleMap] = useState({});
  const [newCommentMap, setNewCommentMap] = useState({});
  const [replyToMap, setReplyToMap] = useState({});
  const [isSubmittingComment, setIsSubmittingComment] = useState({});

  const toggleCommentSection = (itemId) => {
    setCommentVisibleMap((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCommentChange = (itemId, e) => {
    setNewCommentMap((prev) => ({
      ...prev,
      [itemId]: e.target.value,
    }));
  };

  const handleReplyClick = (itemId, commentId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [itemId]: commentId,
    }));
  };

  const handleCancelReply = (itemId) => {
    setReplyToMap((prev) => ({
      ...prev,
      [itemId]: null,
    }));
    setNewCommentMap((prev) => ({
      ...prev,
      [itemId]: "",
    }));
  };

  const handleSubmitComment = async (itemId, updateCheckIns) => {
    const newComment = newCommentMap[itemId];
    if (!newComment || newComment.trim() === "") return;

    setIsSubmittingComment((prev) => ({ ...prev, [itemId]: true }));

    try {
      const commentData = {
        team_id: teamId,
        content: newComment,
        content_type: contentType,
        object_id: itemId,
        parent_id: replyToMap[itemId] || null,
      };

      const response = await axiosClient.post(
        API_ENDPOINTS.COMMENT,
        commentData
      );
      const newCommentFromServer = response.data;

      // Update local state through callback
      updateCheckIns((prevCheckIns) => {
        return prevCheckIns.map((checkIn) => {
          if (checkIn.id === itemId) {
            if (replyToMap[itemId]) {
              // Add as a reply to existing comment
              return {
                ...checkIn,
                comments: checkIn.comments.map((comment) => {
                  if (comment.id === replyToMap[itemId]) {
                    return {
                      ...comment,
                      children: [
                        ...(comment.children || []),
                        newCommentFromServer,
                      ],
                    };
                  }
                  return comment;
                }),
              };
            } else {
              // Add as a new top-level comment at the end
              return {
                ...checkIn,
                comments: [...(checkIn.comments || []), newCommentFromServer],
              };
            }
          }
          return checkIn;
        });
      });

      // Clear input and reply state
      setNewCommentMap((prev) => ({
        ...prev,
        [itemId]: "",
      }));
      setReplyToMap((prev) => ({
        ...prev,
        [itemId]: null,
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleKeyPress = (itemId, e, updateCheckIns) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment(itemId, updateCheckIns);
    }
  };

  return {
    commentVisibleMap,
    newCommentMap,
    replyToMap,
    isSubmittingComment,
    toggleCommentSection,
    handleCommentChange,
    handleReplyClick,
    handleCancelReply,
    handleSubmitComment,
    handleKeyPress,
  };
};

export default useComments; 