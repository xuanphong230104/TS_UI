/**
 * Format time difference between now and a given date
 * @param {string|Date} createdAt - The date to compare with current time
 * @returns {string} Formatted time difference
 */
export const formatTimeDiff = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffSeconds = Math.floor((now - created) / 1000);
  
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} minutes ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} hours ago`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} days ago`;
  
    return created.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    });
  };
  
  /**
   * Format a date to display weekday
   * @param {string|Date} date - The date to format
   * @returns {string} Formatted weekday
   */
  export const getWeekday = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });
  };
  
  /**
   * Format a date to display month and day
   * @param {string|Date} date - The date to format
   * @returns {string} Formatted date (Month Day)
   */
  export const getFormattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };
  
  /**
   * Group items by date
   * @param {Array} items - Array of objects with created_at property
   * @returns {Object} Object with dates as keys and arrays of items as values
   */
  export const groupItemsByDate = (items) => {
    const grouped = {};
  
    items.forEach((item) => {
      const date = getFormattedDate(item.created_at);
      const weekday = getWeekday(item.created_at);
  
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