/**
 * Sort comments by date (oldest to newest)
 * @param {Array} comments - Array of comment objects
 * @returns {Array} Sorted comments
 */
export const sortComments = (comments = []) => {
    return [...comments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  };
  
  /**
   * Calculate total comments including nested replies
   * @param {Array} comments - Array of comment objects
   * @returns {number} Total count of comments and replies
   */
  export const getCommentCount = (comments = []) => {
    return comments.reduce((total, comment) => {
      // Count the comment itself
      let count = 1;
      // Add counts of all child comments recursively
      if (comment.children && comment.children.length > 0) {
        count += getCommentCount(comment.children);
      }
      return total + count;
    }, 0);
  };
  
  /**
   * Update nested comments by adding a new reply to the specified parent
   * @param {Array} comments - Array of comment objects
   * @param {string|number} parentId - ID of the parent comment
   * @param {Object} newComment - New comment to add as a reply
   * @returns {Array} Updated comments array
   */
  export const updateNestedComments = (comments, parentId, newComment) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          children: [...(comment.children || []), newComment],
        };
      }
      if (comment.children && comment.children.length > 0) {
        return {
          ...comment,
          children: updateNestedComments(comment.children, parentId, newComment),
        };
      }
      return comment;
    });
  };
  
  /**
   * Find a comment by ID in a nested comment structure
   * @param {Array} comments - Array of comment objects
   * @param {string|number} commentId - ID of the comment to find
   * @returns {Object|null} Found comment or null
   */
  export const findCommentById = (comments, commentId) => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      
      if (comment.children && comment.children.length > 0) {
        const found = findCommentById(comment.children, commentId);
        if (found) return found;
      }
    }
    
    return null;
  };