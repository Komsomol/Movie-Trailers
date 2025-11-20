const moment = require("moment"); // Importing the moment library for date manipulation

// Function to check if a given date falls within a specific range
const checkDateRange = function (ISODate) {
  const today = moment().utc().format("YYYY-MM-DD"); // Get the current date in UTC format
  const diff = moment(today).subtract(10, "days").format("YYYY-MM-DD"); // Subtract 10 days from the current date
  return moment(ISODate).utc().isBetween(diff, today, null, "(]"); // Check and return if the date falls within the range
};

// Keywords to exclude and to search for in titles
const excludedKeywords = ["blu-ray", "season", "episode", "marvel comics", "teaser trailer", "teaser", "red band"];
const searchKeywords = ["official trailer"];

// Function to filter and retrieve only specific videos based on title and date range
const getTrailersOnly = (file, channelName) => {
  try {
    return file.items.reduce((videos, item) => {
      const title = item.snippet.title.toLowerCase(); // Convert title to lowercase
      
      const isTargeted = searchKeywords.some(keyword => title.includes(keyword));
      const isExcluded = excludedKeywords.some(keyword => title.includes(keyword));
      const isInDateRange = checkDateRange(item.snippet.publishedAt);

      if (isTargeted && !isExcluded && isInDateRange) {
        const obj = {
          channel: channelName,
          name: item.snippet.title,
          date: moment(item.snippet.publishedAt).utc().format("LLLL"),
          dateString: moment(item.snippet.publishedAt).utc(),
          link: item.snippet.resourceId.videoId,
          thumbnail: item.snippet.thumbnails.high.url,
        };
        videos.push(obj);
      }
      return videos;
    }, []);
  } catch (error) {
    return error; // Return any error that occurs during the process
  }
};

module.exports = getTrailersOnly; // Export the getTrailersOnly function as a module
