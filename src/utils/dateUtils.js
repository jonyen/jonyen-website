/**
 * Calculates the number of days since a given date
 * @param {Date|string} startDate - The starting date (Date object or date string)
 * @returns {number} The number of days since the start date (positive if startDate is in the past, negative if in the future)
 */
export function getDaysSince(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate the difference in milliseconds
  const diffTime = today - start;
  
  // Convert milliseconds to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}


