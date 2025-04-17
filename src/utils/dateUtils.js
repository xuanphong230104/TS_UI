/**
 * Format time difference between now and a given date
 * @param {string} createdAt - ISO date string
 * @returns {string} Formatted time difference
 */
export const formatTimeDiff = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffSeconds = Math.floor((now - created) / 1000);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffSeconds < 3600)
    return `${Math.floor(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400)
    return `${Math.floor(diffSeconds / 3600)} hours ago`;
  if (diffSeconds < 604800)
    return `${Math.floor(diffSeconds / 86400)} days ago`;

  return created.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "short",
    day: "numeric",
  });
};

/**
 * Group items by date
 * @param {Array} items - Array of items with created_at property
 * @param {string} tabKey - Current tab key for filtering
 * @returns {Object} Items grouped by date
 */
export const groupItemsByDate = (items, tabKey) => {
  const grouped = {};
  
  // Filter items based on the current tab
  const filteredItems = items.filter((item) => {
    if (tabKey === "allUpdates") return true;
    if (tabKey === "checkIns") return item.content_type === "checkin";
    if (tabKey === "reports") return item.content_type === "report";
    return true;
  });

  filteredItems.forEach((item) => {
    const date = new Date(item.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
    const weekday = new Date(item.created_at).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!grouped[date]) {
      grouped[date] = {
        weekday,
        items: [],
      };
    }
    grouped[date].items.push(item);
  });
  
  return grouped;
};

/**
 * Calculate total comments including replies
 * @param {Array} comments - Array of comment objects
 * @returns {number} Total comment count
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