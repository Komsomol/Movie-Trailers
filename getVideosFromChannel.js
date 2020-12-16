require("dotenv").config();
const apiKey = process.env.YT_API_KEY;
const fetch = require("node-fetch");

const getVideosFromChannel = async (channelID, uploadsID, channelName) => {
  const videosurl =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=" +
    uploadsID +
    "&channelId=" +
    channelID +
    "&key=" +
    apiKey +
    "";

  try {
    const response = await fetch(videosurl);
    const data = response.json();
    return data;
  } catch (error) {
    return error;
  }
};

module.exports = getVideosFromChannel;